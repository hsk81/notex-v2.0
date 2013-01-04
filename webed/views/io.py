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
    return file_upload () ## TODO!

###############################################################################
###############################################################################

app.register_blueprint (io)

###############################################################################
###############################################################################
