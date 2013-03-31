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
@db.commit ()
def setup_rest_project (json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    mime = request.args.get ('mime')
    assert mime == 'application/project+rest'

    path = os.path.join ('tpl', '[application!project+rest].zip')
    path = os.path.join (archive_path, path)
    path = os.path.abspath (path)

    with open (path) as stream:
        fs = FileStorage (stream=stream, filename=path)
        result = archive_upload (file=fs, skip_commit=True, json=False)
        for node in result['nodes']: setup_rest (node)

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return jsonify (success=True, mime=mime, nodes=map (
            lambda node: dict (uuid=node.uuid), result['nodes']))

def setup_rest (node):

    name = request.args.get ('name')
    assert name; node.name = name
    mime = request.args.get ('mime')
    assert mime; node.mime = mime

###############################################################################
###############################################################################

@project.route ('/setup-latex-project/', methods=['GET', 'POST'])
@db.commit ()
def setup_latex_project (json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    mime = request.args.get ('mime')
    assert mime == 'application/project+latex'

    path = os.path.join ('tpl', '[application!project+latex].zip')
    path = os.path.join (archive_path, path)
    path = os.path.abspath (path)

    with open (path) as stream:
        fs = FileStorage (stream=stream, filename=path)
        result = archive_upload (file=fs, skip_commit=True, json=False)
        for node in result['nodes']: setup_latex (node)

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return jsonify (success=True, mime=mime, nodes=map (
            lambda node: dict (uuid=node.uuid), result['nodes']))

def setup_latex (node):

    name = request.args.get ('name')
    assert name; node.name = name
    mime = request.args.get ('mime')
    assert mime; node.mime = mime

###############################################################################
###############################################################################

@project.route ('/setup-generic-project/', methods=['GET', 'POST'])
@db.commit ()
def setup_generic_project (json=True):

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    mime = request.args.get ('mime')
    assert mime == 'application/project'

    path = os.path.join ('tpl', '[application!project].zip')
    path = os.path.join (archive_path, path)
    path = os.path.abspath (path)

    with open (path) as stream:
        fs = FileStorage (stream=stream, filename=path)
        result = archive_upload (file=fs, skip_commit=True, json=False)
        for node in result['nodes']: setup_generic (node)

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return jsonify (success=True, mime=mime, nodes=map (
            lambda node: dict (uuid=node.uuid), result['nodes']))

def setup_generic (node):

    name = request.args.get ('name')
    assert name; node.name = name
    mime = request.args.get ('mime')
    assert mime; node.mime = mime

###############################################################################
###############################################################################

app.register_blueprint (project)

###############################################################################
###############################################################################
