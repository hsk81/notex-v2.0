__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint

from ..app import app
from ..util import JSON
from .io import archive_upload

import os.path

###############################################################################
###############################################################################

project = Blueprint ('project', __name__)

###############################################################################
###############################################################################

@project.route ('/setup-project/<mime>', methods=['POST'])
def setup_project (mime, json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path

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

    with open (path_to) as file:
        result = archive_upload (file, json=False)
        setup_details (result['nodes'])

    if not json:
        return dict (success=True, mime=mime, nodes=result.nodes)
    else:
        return JSON.encode (dict (success=True, mime=mime, nodes=map (
            lambda node:node.uuid, result.nodes)))

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
