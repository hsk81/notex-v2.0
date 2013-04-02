__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.utils import secure_filename
from flask import Blueprint, make_response, send_from_directory
from flask.globals import request

from ..app import app
from ..ext import db, obj_cache, logger
from ..util import Q, jsonify
from ..views import mime as MIME

from ..models import Node
from ..models import Leaf
from ..models import TextProperty
from ..models import Base64Property

import os
import re
import errno
import shutil
import urllib
import base64
import zipfile
import tempfile

from cStringIO import StringIO

###############################################################################
###############################################################################

io = Blueprint ('io', __name__)

###############################################################################
###############################################################################

@io.route ('/file-upload/', methods=['POST'])
@db.commit ()
def file_upload ():

    if not request.is_xhr:
        request.json = request.args

    source = request.files['file']
    if not source:
        return jsonify (success=False)

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid

    if root_uuid == '00000000-0000-0000-0000-000000000000':
        root = Q (Node.query).one (uuid=app.session_manager.anchor)
        assert root
    else:
        root = Q (Node.query).one (uuid=root_uuid)
        assert root

    name = secure_filename (source.filename)
    assert name
    mime = MIME.guess_mime (name) or source.mimetype
    assert mime

    @db.nest ()
    def create_leaf (name, root, mime):

        if MIME.is_text (mime):
            leaf, _ = create_txt (name, root, mime, source=source)
        else:
            leaf, _ = create_bin (name, root, mime, source=source)

        db.session.add (leaf)
        return leaf

    leaf = create_leaf (name, root, mime)
    assert leaf and leaf.id

    db.session.execute (db.sql.select ([db.sql.func.npt_insert_node (
        leaf.base.id, leaf.id)]))

    return jsonify (success=True)

###############################################################################
###############################################################################

@io.route ('/archive-upload/', methods=['POST'])
@db.commit (lest=lambda *a, **kw: 'skip_commit' in kw and kw['skip_commit'])
def archive_upload (source=None, base=None, skip_commit=None, json=True):
    source = source if source else request.files['file']

    if not source:
        return jsonify (success=False, filename=None,
            message='file expected')

    if not source.filename or len (source.filename) == 0:
        return jsonify (success=False, filename=None,
            message='filename invalid')

    if not base:
        base = Q (Node.query).one (uuid=app.session_manager.anchor)

    with tempfile.TemporaryFile () as zip_file:

        source.save (zip_file)
        zip_file.flush ()

        if not zipfile.is_zipfile (zip_file):
            return jsonify (success=False, filename=source.filename,
                message='ZIP format expected')

        prj_mime = get_project_mime (source.filename)
        assert prj_mime

        temp_path = tempfile.mkdtemp ()
        extract (zip_file, path=temp_path)
        nodes = create_prj (temp_path, base, prj_mime)
        shutil.rmtree (temp_path)

    if not skip_commit:
        for node in nodes: db.session.execute (
            db.sql.select ([db.sql.func.npt_insert_node (base.id, node.id)]))

    if not json:
        return dict (success=True, filename=source.filename, nodes=nodes)
    else:
        return jsonify (success=True, filename=source.filename, nodes=map (
            lambda node: dict (uuid=node.uuid), nodes))

###############################################################################

def get_project_mime (filename):
    """
    Returns `mime` which should be encoded in `filename`; if it is *not* then
    it looks if the `mime` has been provided as a request argument; otherwise
    simply `application/project` is returned.
    """
    try:
        zip_mime = os.path.splitext (filename)[0]
        zip_mime = zip_mime.split ('[')[-1].split (']')[0]
        zip_mime = zip_mime.replace ('!', '/')

        if not re.match (r'^application/project(\+\w+)?$', zip_mime):
            zip_mime = None

    except IndexError:
        zip_mime = None
    except Exception, ex:
        logger.debug (ex)
        zip_mime = None

    if not zip_mime: zip_mime = request.args.get ('mime', None)
    if not zip_mime: zip_mime = 'application/project'

    return zip_mime.strip ()

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

@db.nest ()
def create_prj (path, base, mime):
    lookup = {path: base}

    for cur_path, dir_names, file_names in os.walk (path):
        root = lookup.get (cur_path)
        assert root

        for dn in dir_names:
            mime = 'application/folder' if root.root else mime
            node = create_dir (dn, root, mime)
            db.session.add (node); lookup[os.path.join (cur_path, dn)] = node

        for fn in file_names:
            mime = MIME.guess_mime_ex (fn, cur_path)

            if MIME.is_text (mime):
                leaf, _ = create_txt (fn, root, mime, path=cur_path)
            else:
                leaf, _ = create_bin (fn, root, mime, path=cur_path)

            db.session.add (leaf)
            lookup[os.path.join (cur_path, fn)] = leaf

    return filter (lambda n: n.root == base, lookup.values ())

def create_dir (name, root, mime):

    return Node (name, root, mime=mime)

def create_txt (name, root, mime, path=None, source=None):
    assert path and not source or not path and source

    if path:
        with open (os.path.join (path, name)) as source:
            data = source.read ().replace ('\r\n', '\n')
    else:
        data = source.read ().replace ('\r\n', '\n')

    leaf = Leaf (name, root, mime=mime)
    prop = TextProperty ('data', data, leaf, mime=mime)

    return leaf, prop

def create_bin (name, root, mime, path=None, source=None):
    assert path and not source or not path and source

    if path:
        with open (os.path.join (path, name)) as source:
            data = source.read ()
    else:
        data = source.read ()

    leaf = Leaf (name, root, mime=mime)
    prop = Base64Property ('data', data, leaf, mime=mime)

    return leaf, prop

###############################################################################
###############################################################################

@io.route ('/archive-download/<uuid>', methods=['GET', 'POST'])
def archive_download (uuid):

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    node = Q (base.subnodes).one (uuid=uuid)

    data_key = obj_cache.make_key (uuid, 'data')
    size_key = obj_cache.make_key (uuid, 'size')

    if obj_cache.exists (data_key):
        if request.args.get ('fetch', False) and app.dev:

            with tempfile.NamedTemporaryFile (delete=False) as temp:
                temp.write (obj_cache.get (data_key))
                path, filename = os.path.split (temp.name)

            response = send_from_directory (path, filename,
                as_attachment=True, attachment_filename='%s [%s].zip' % (
                    node.name.encode ('utf-8'), node.mime.replace ('/', '!')))

        elif request.args.get ('fetch', False):

            response = make_response ()
            response.headers['Content-Disposition'] = \
                'attachment;filename="%s [%s].zip"' % (
                    node.name.encode ('utf-8'), node.mime.replace ('/', '!'))
            response.headers['Content-Length'] = \
                obj_cache.get_value (size_key)
            response.headers['Content-Type'] = \
                'application/octet-stream'
            response.headers['X-Accel-Redirect'] = \
                '/cache/?' + obj_cache.prefix_key (data_key)
        else:
            response = jsonify (success=True, name=node.name)
    else:
        data = compress (node)
        obj_cache.set_value (data_key, data, expiry=15) ##[s]
        size = len (data)
        obj_cache.set_value (size_key, size, expiry=15) ##[s]

        response = jsonify (success=True, name=node.name)

    return response

###############################################################################

def compress (root, crlf=True):

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

        if type (prop) == TextProperty:
            if crlf:
                data = prop.data.replace ('\n', '\r\n').encode ('utf-8')
            else:
                data = prop.data.encode ('utf-8')
        elif type (prop) == Base64Property:
            data = base64.decodestring (prop.data.split (',')[1])
        else:
            raise Exception ('invalid property: %r' % prop)

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

@io.route ('/dictionaries/<path:filename>', methods=['GET'])
def dictionary_download (filename):

    path = os.path.abspath (app.config['TYPO_DICT_PATH'])
    assert os.path.exists (path)

    return send_from_directory (path, filename, as_attachment=True)

###############################################################################
###############################################################################

app.register_blueprint (io)

###############################################################################
###############################################################################
