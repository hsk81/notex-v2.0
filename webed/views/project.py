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

    document_type = request.args.get ('documentType')
    assert document_type in ['article', 'report']
    latex_backend = request.args.get ('latexBackend')
    assert latex_backend in ['xelatex', 'pdflatex']

    path = os.path.join ('tpl', '[application!project+rest].{%s,%s}.zip')
    path = path % (document_type, latex_backend)
    path = os.path.join (archive_path, path)

    with open (path) as stream:
        fs = FileStorage (stream=stream, filename=path)
        result = archive_upload (file=fs, skip_commit=True, json=False)
        for node in result['nodes']: setup_rest (node)

    if not json:
        return dict (success=True, mime=mime, nodes=result['nodes'])
    else:
        return jsonify (success=True, mime=mime, nodes=map (
            lambda node: dict (uuid=node.uuid), result['nodes']))

def setup_rest (node, indent=' ' * 8):

    name = request.args.get ('name')
    assert name; node.name = name
    mime = request.args.get ('mime')
    assert mime; node.mime = mime

    authors = request.args.get ('authors')
    assert authors
    document_type = request.args.get ('documentType')
    assert document_type in ['article', 'report']
    font_size = request.args.get ('fontSize')
    assert font_size
    no_columns = request.args.get ('noColumns')
    assert no_columns in ['1', '2']
    title_flag = request.args.get ('titleFlag')
    assert title_flag in ['true', 'false']
    toc_flag = request.args.get ('tocFlag')
    assert toc_flag in ['true', 'false']
    index_flag = request.args.get ('indexFlag')
    assert index_flag in ['true', 'false']

    if no_columns == '2':
        no_columns = '\n%s\\\\twocolumn' % indent
    else:
        no_columns = '\n%s\\\\onecolumn' % indent

    if title_flag == 'true':
        title_flag = '\n%s\\\\maketitle' % indent
    else:
        title_flag = "''"

    if toc_flag == 'true':
        if document_type == 'article':
            toc_flag = '\n%s\\\\tableofcontents\\\\hrule' % indent
        elif document_type == 'report':
            toc_flag = '\n%s\\\\cleardoublepage\\\\tableofcontents' % indent
        else:
            toc_flag = "''"
    else:
        toc_flag = "''"

    if index_flag == 'true':
        index_flag = '\n%s\\\\printindex' % indent
    else:
        index_flag = "''"

    for path, nodes, leafs in node.walk (field='name'):

        for leaf in leafs:
            if leaf.mime == 'text/x-yaml':

                prop = leaf.props.filter_by (name='data').first ()
                data = prop.data \
                    .replace ('${PROJECT}', name) \
                    .replace ('${AUTHORS}', authors) \
                    .replace ('${FONTPSZ}', font_size) \
                    .replace ('${COLUMNS}', no_columns) \
                    .replace ('${MKTITLE}', title_flag) \
                    .replace ('${MKTABLE}', toc_flag) \
                    .replace ('${MKINDEX}', index_flag) \
                    .replace ("|''", "")

                prop.set_data (data, skip_patch=True)

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
