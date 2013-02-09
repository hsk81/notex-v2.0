__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.datastructures import FileStorage
from flask.globals import request
from flask import Blueprint

from ..app import app
from ..ext import db
from ..util import JSON
from .io import archive_upload

import os.path

###############################################################################
###############################################################################

project = Blueprint ('project', __name__)

###############################################################################
###############################################################################

@project.route ('/setup-project/', methods=['GET', 'POST'])
@db.commit (lest=lambda *a, **kw: 'skip_commit' in kw and kw['skip_commit'])
def setup_project (name=None, mime=None, skip_commit=None, json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path

    name = request.args.get ('name', name)
    assert name
    mime = request.args.get ('mime', mime)
    assert mime

    if mime == 'application/project+latex':
        path = os.path.join ('tpl', 'project-latex.zip')
        setup_details = setup_latex
    elif mime == 'application/project+rest':
        path = os.path.join ('tpl', 'project-rest.zip')
        setup_details = setup_rest
    else:
        path = os.path.join ('tpl', 'project.zip')
        setup_details = setup_default

    path_to = os.path.join (archive_path, path)
    path_to = os.path.abspath (path_to)

    with open (path_to) as stream:
        fs = FileStorage (stream=stream, filename=path)
        result = archive_upload (file=fs, skip_commit=True, json=False)
        for node in result['nodes']: node.name = name
        setup_details (result['nodes'])

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return JSON.encode (dict (success=True, mime=mime, nodes=
            map (lambda node:dict (uuid=node.uuid, uuid_path=node.uuid_path),
                result['nodes'])))

###############################################################################
###############################################################################

def setup_latex (nodes):
    assert isinstance (nodes, list)

def setup_rest (nodes):
    assert isinstance (nodes, list)

def setup_default (nodes):
    assert isinstance (nodes, list)

###############################################################################
###############################################################################

app.register_blueprint (project)

###############################################################################
###############################################################################
