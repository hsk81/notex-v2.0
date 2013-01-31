__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.utils import secure_filename
from sqlalchemy.sql import func, select
from flask import Blueprint, Response
from flask.globals import request

from ..app import app
from ..ext import db, cache, logger
from ..util import Q, JSON, jsonify

from ..models import Node
from ..models import Leaf
from ..models import TextProperty
from ..models import LargeBinaryProperty

import subprocess
import mimetypes
import tempfile
import zipfile
import base64
import urllib
import shutil
import errno
import os

from cStringIO import StringIO

###############################################################################
###############################################################################

io = Blueprint ('io', __name__)

###############################################################################
###############################################################################

@io.route ('/file-upload/', methods=['POST'])
@db.session.wrap ()
def file_upload ():

    if not request.is_xhr:
        request.json = request.args

    file = request.files['file']
    if not file:
        return JSON.encode (dict (success=False))

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid

    if root_uuid == '00000000-0000-0000-0000-000000000000':
        root = Q (Node.query).one (uuid=app.session_manager.anchor)
        assert root
    else:
        root = Q (Node.query).one (uuid=root_uuid)
        assert root

    name = secure_filename (file.filename)
    assert name
    mime = file.mimetype
    assert mime

    @db.session.nest ()
    def create_leaf (name, root, mime):

        if mime.lower () == 'text/plain':
            leaf, _ = create_txt (name, root, mime, file=file)
        elif mime.lower ().startswith ('image'):
            leaf, _ = create_img (name, root, mime, file=file)
        else:
            leaf, _ = create_bin (name, root, mime, file=file)

        db.session.add (leaf)
        return leaf

    leaf = create_leaf (name, root, mime); assert leaf and leaf.id
    db.session.execute (select ([func.npt_insert_node (leaf.base.id,leaf.id)]))

    return JSON.encode (dict (success=True))

###############################################################################
###############################################################################

@io.route ('/archive-upload/', methods=['POST'])
@db.wrap (lest=lambda *a, **kw: 'skip_commit' in kw and kw['skip_commit'])
def archive_upload (file=None, base=None, skip_commit=None):
    file = file if file else request.files['file']

    if not file:
        return JSON.encode (dict (success=False, filename=None,
            message='file expected'))

    if not file.filename or len (file.filename) == 0:
        return JSON.encode (dict (success=False, filename=None,
            message='filename invalid'))

    if not base:
        base = Q (Node.query).one (uuid=app.session_manager.anchor)

    with tempfile.TemporaryFile () as zip_file:

        file.save (zip_file)
        zip_file.flush ()

        if not zipfile.is_zipfile (zip_file):
            return JSON.encode (dict (success=False, filename=file.filename,
                message='ZIP format expected'))

        zip_name = secure_filename (file.filename)
        zip_name = os.path.splitext (zip_name)[0]

        temp_path = tempfile.mkdtemp ()
        extract (zip_file, path=temp_path)
        nodes = create_prj (temp_path, zip_name, base)
        shutil.rmtree (temp_path)

    if not skip_commit:
        for node in nodes: db.session.execute (
            select ([func.npt_insert_node (base.id, node.id)]))

    return JSON.encode (dict (success=True, filename=file.filename))

###############################################################################

def extract (zip_file, path):

    def sanitize (path):

        path = urllib.unquote_plus (path)
        path = os.path.join (os.sep, path)
        path = os.path.abspath (path)
        path = path.lstrip (os.sep)

        return path

    with zipfile.ZipFile (zip_file, 'r') as zip_buffer:

        infolist = zip_buffer.infolist ()
        swap = lambda (lhs, rhs): (rhs, lhs)
        key = lambda zi: swap (os.path.splitext (zi.filename))

        for zi in sorted (infolist, key=key, reverse=True):
            zi.filename = sanitize (zi.filename)

            try:
                zip_buffer.extract (zi, path=path)
            except IOError, ex:
                if ex.errno != errno.EISDIR:
                    raise ex

###############################################################################

@db.session.nest ()
def create_prj (path, name, base):
    cache = {path: base}

    for cur_path, dir_names, file_names in os.walk (path):
        root = cache.get (cur_path); assert root

        for dn in dir_names:
            mime = 'application/' + ('folder' if root.root else 'project')
            node = create_dir (dn, root, mime)
            db.session.add (node); cache[os.path.join (cur_path, dn)] = node

        for fn in file_names:
            mime = guess_mime (cur_path, fn)
            if mime and mime == 'text/plain':
                leaf, _ = create_txt (fn, root, mime, path=cur_path)
            elif mime and mime.startswith ('image'):
                leaf, _ = create_img (fn, root, mime, path=cur_path)
            else:
                leaf, _ = create_bin (fn, root, mime, path=cur_path)
            db.session.add (leaf); cache[os.path.join (cur_path, fn)] = leaf

    return filter (lambda n: n.root == base, cache.values ())

def create_dir (name, root, mime):

    return Node (name, root, mime=mime)

def create_txt (name, root, mime, path=None, file=None):
    assert path and not file or not path and file

    if path:
        with open (os.path.join (path, name)) as file:
            data = file.read ().replace ('\r\n','\n')
    else:
        data = file.read ().replace ('\r\n','\n')

    leaf = Leaf (name, root, mime=mime)
    prop = TextProperty ('data', data, leaf, mime=mime)

    return leaf, prop

def create_img (name, root, mime, path=None, file=None):
    assert path and not file or not path and file

    if path:
        with open (os.path.join (path, name)) as file:
            data = 'data:%s;base64,%s' % (mime, base64.encodestring (
                file.read ()))
    else:
        data = 'data:%s;base64,%s' % (mime, base64.encodestring (
            file.read ()))

    leaf = Leaf (name, root, mime=mime)
    prop = TextProperty ('data', data, leaf, mime=mime)

    return leaf, prop

def create_bin (name, root, mime, path=None, file=None):
    assert path and not file or not path and file

    if path:
        with open (os.path.join (path, name)) as file:
            data = file.read ()
    else:
        data = file.read ()

    leaf = Leaf (name, root, mime=mime)
    prop = LargeBinaryProperty ('data', data, leaf, mime=mime)

    return leaf, prop

###############################################################################

def guess_mime (path, name):

    if not mimetypes.inited: mimetypes.init ()
    mime, _ = mimetypes.guess_type (name)

    if not mime:
        path = os.path.join (path, name)
        args = ['/usr/bin/file', '-b', '--mime-type', path]

        try:
            mime = subprocess.check_output (args)
        except subprocess.CalledProcessError, ex:
            logger.exception (ex)

    return mime.rstrip ().lower () if mime else None

###############################################################################
###############################################################################

@io.route ('/archive-download/', methods=['GET', 'POST'])
def archive_download (chunk_size = 256*1024):

    node_uuid = request.args.get ('node_uuid', None)
    assert node_uuid
    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    node = Q (base.subnodes).one (uuid=node_uuid)
    assert node

    archive_key = cache.make_key (node_uuid, 'archive', 'zip')
    content_val = cache.get (archive_key)

    if content_val:
        if request.args.get ('fetch', False):

            content_len = len (content_val)
            content_csz = chunk_size

            def next_chunk (length, size):
                for index in range (0, length, size):
                    yield content_val[index:index+size]

            response = Response (next_chunk (content_len, content_csz))
            response.headers ['Content-Length'] = content_len
            response.headers ['Content-Disposition'] = \
                'attachment;filename="%s.zip"' % node.name.encode ("utf-8")
        else:
            response = jsonify (success=True, name=node.name)
            cache.touch (archive_key, expiry=15) ## refresh
    else:
        response = jsonify (success=True, name=node.name)
        cache.set (archive_key, compress (node), expiry=15) ## seconds

    return response

###############################################################################

def compress (root):

    str_buffer = StringIO ()
    zip_buffer = zipfile.ZipFile (str_buffer, 'w', zipfile.ZIP_DEFLATED)

    def compress_node (node, node_path):

        for path, nodes, leafs in node.walk (field='name'):
            for sub_node in nodes:
                compress_node (sub_node, os.path.join (node_path, path))
            for sub_leaf in leafs:
                compress_leaf (sub_leaf, os.path.join (node_path, path))

    def compress_leaf (leaf, leaf_path):

        prop = Q (leaf.props).one (name='data')
        assert prop

        if leaf.mime == 'text/plain':
            data = prop.data.replace ('\n','\r\n').encode ('utf-8')
        elif leaf.mime.startswith ('image'):
            data = base64.decodestring (prop.data.split (',')[1])
        else:
            data = prop.data

        assert data is not None
        path = os.path.join (leaf_path, leaf.name)
        path = os.path.normpath (path)
        zip_buffer.writestr (path, bytes=data)

    if isinstance (root, Leaf):
        compress_leaf (root, leaf_path='')
    else:
        compress_node (root, node_path='')

    zip_buffer.close ()
    content_val = str_buffer.getvalue ()
    str_buffer.close ()

    return content_val

###############################################################################
###############################################################################

app.register_blueprint (io)

###############################################################################
###############################################################################
