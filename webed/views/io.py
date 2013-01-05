__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.utils import secure_filename
from flask.globals import request
from flask import Blueprint

from ..app import app
from ..ext import db
from ..util import JSON, Q

from ..models import Node, Leaf
from ..models import TextProperty, LargeBinaryProperty

import mimetypes
import tempfile
import zipfile
import urllib
import shutil
import os

###############################################################################
###############################################################################

io = Blueprint ('io', __name__)

###############################################################################
###############################################################################

@io.route ('/file-upload/', methods=['POST'])
def file_upload ():

    if not request.is_xhr:
        request.json = request.args

    file = request.files['file']
    if not file: return JSON.encode (dict (success=False))

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
    data = file.read ()
    assert data is not None

    if mime == 'text/plain':
        TProperty = TextProperty
    else:
        TProperty = LargeBinaryProperty

    leaf = Leaf (name, root, mime=mime)
    db.session.add (leaf)
    property = TProperty ('data', data, leaf, mime=mime)
    db.session.add (property)
    db.session.commit ()

    return JSON.encode (dict (success=True))

###############################################################################
###############################################################################

@io.route ('/archive-upload/', methods=['POST'])
def archive_upload ():
    file = request.files['file']

    if not file:
        return JSON.encode (dict (success=False, filename=None,
            message='file expected'))

    if not file.filename or len (file.filename) == 0:
        return JSON.encode (dict (success=False, filename=None,
            message='filename invalid'))

    with tempfile.TemporaryFile () as zip_file:

        file.save (zip_file)
        zip_file.flush ()

        if not zipfile.is_zipfile (zip_file):
            return JSON.encode (dict (success=False, filename=file.filename,
                message='ZIP format expected'))

        zip_name = secure_filename (file.filename)
        zip_name = os.path.splitext (zip_name)[0]

        temp_path = tempfile.mkdtemp  ()
        extract (zip_file, path=temp_path)
        create_prj (path=temp_path, name=zip_name)
        shutil.rmtree (temp_path)

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
        for zi in zip_buffer.infolist ():

            zi.filename = sanitize (zi.filename)
            zip_buffer.extract (zi, path=path)

###############################################################################

def create_prj (path, name):

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base

    prj_node = Node (name, base, mime='application/project')
    db.session.add (prj_node); cache = {path: prj_node}

    for cur_path, dir_names, file_names in os.walk (path):
        root = cache.get (cur_path)
        assert root

        for dn in dir_names:
            node = create_dir (cur_path, dn, root, mime='application/folder')
            db.session.add (node); cache[os.path.join (cur_path, dn)] = node

        for fn in file_names:
            mime = guess_mime (cur_path, fn)
            if mime == 'text/plain':
                leaf, _ = create_txt (cur_path, fn, root, mime=mime)
                db.session.add (leaf)
            else:
                leaf, _ = create_bin (cur_path, fn, root, mime=mime)
                db.session.add (leaf)

    db.session.commit ()
    return prj_node

def create_dir (path, name, root, mime):

    return Node (name, root, mime=mime)

def create_txt (path, name, root, mime):

    with open (os.path.join (path, name)) as file:
        data = file.read ().replace ('\r\n','\n')

    leaf = Leaf (name, root, mime=mime)
    prop = TextProperty ('data', data, leaf, mime=mime)

    return leaf, prop

def create_bin (path, name, root, mime):

    with open (os.path.join (path, name)) as file:
        data = file.read () ## TODO: 'data:%s;base64,..'?

    leaf = Leaf (name, root, mime=mime)
    prop = LargeBinaryProperty ('data', data, leaf, mime=mime)

    return leaf, prop

###############################################################################

def guess_mime (path, name):

    if not mimetypes.inited:
        mimetypes.init ()

    ##
    ## TODO: Use better discriminator, that uses the content!
    ##

    mimetype, _ = mimetypes.guess_type (name)
    return mimetype

###############################################################################
###############################################################################

app.register_blueprint (io)

###############################################################################
###############################################################################
