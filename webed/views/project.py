__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.datastructures import FileStorage
from flask.globals import request
from flask import Blueprint

from ..app import app
from ..ext import db
from ..util import jsonify
from .io import archive_upload

import os.path

###############################################################################
###############################################################################

project = Blueprint ('project', __name__)

###############################################################################
###############################################################################

@project.route ('/setup-rest-project/', methods=['GET', 'POST'])
@db.commit (lest=lambda *a, **kw: 'skip_commit' in kw and kw['skip_commit'])
def setup_rest_project (conf=None, skip_commit=None, json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    mime = get_for ('mime', conf)
    assert mime

    path = os.path.join ('tpl', 'project-rest.zip')
    path_to = os.path.join (archive_path, path)
    path_to = os.path.abspath (path_to)

    with open (path_to) as stream:
        fs = FileStorage (stream=stream, filename=path)
        result = archive_upload (file=fs, skip_commit=True, json=False)
        for node in result['nodes']: setup_rest (node, conf)

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return jsonify (success=True, mime=mime, nodes=map (
            lambda node: dict (uuid=node.uuid), result['nodes']))

###############################################################################
###############################################################################

@project.route ('/setup-project/', methods=['GET', 'POST'])
@db.commit (lest=lambda *a, **kw: 'skip_commit' in kw and kw['skip_commit'])
def setup_project (conf=None, skip_commit=None, json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    mime = get_for ('mime', conf)
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
        for node in result['nodes']: setup_details (node, conf)

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return jsonify (success=True, mime=mime, nodes=map (
            lambda node: dict (uuid=node.uuid), result['nodes']))

###############################################################################
###############################################################################

def setup_latex (node, conf=None):

    name = get_for ('name', conf)
    assert name; node.name = name
    mime = get_for ('mime', conf)
    assert mime; node.mime = mime

def setup_rest (node, conf=None):

    name = get_for ('name', conf)
    assert name; node.name = name
    mime = get_for ('mime', conf)
    assert mime; node.mime = mime

def setup_default (node, conf=None):

    name = get_for ('name', conf)
    assert name; node.name = name
    mime = get_for ('mime', conf)
    assert mime; node.mime = mime

###############################################################################
###############################################################################

def get_for (key, conf, default=None):

    if conf:
        return conf[key] if key in conf else default
    else:
        return request.args.get (key, default)

###############################################################################
###############################################################################

app.register_blueprint (project)

###############################################################################
###############################################################################
