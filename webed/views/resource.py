__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask import Blueprint, make_response, send_from_directory
from ..app import app

import os

###############################################################################
###############################################################################

resource = Blueprint ('resource', __name__)

###############################################################################
###############################################################################

@resource.route ('/btc-donate.html', methods=['GET'])
def btc_donate ():

    return render_template ('btc-donate.html')

###############################################################################
###############################################################################

@resource.route ('/sphinx.err/<uuid>/<path:file_path>', methods=['GET'])
def sphinx_err (uuid, file_path):

    temp_path = app.config['SPHINX_TEMP_PATH']
    assert os.path.exists (temp_path)
    uuid_path = os.path.join (temp_path, uuid)
    assert os.path.exists (uuid_path)

    return send_from_directory (uuid_path, file_path, mimetype='text/plain')

###############################################################################
###############################################################################

@resource.route ('/StatusBar.worker.js', methods=['GET'])
def statusbar_worker (
        base='webed/static/webed-ext',
        path='app/controller/statusbar/StatusBar.worker.js'):

    path_to = os.path.join (base, path)
    assert os.path.exists (path_to)

    return make_resource_response (path_to, 'text/javascript')

def make_resource_response (path, content_type):

    response = make_response (open (os.path.abspath (path)).read ())
    response.headers['Content-Type'] = content_type
    return response

###############################################################################
###############################################################################

app.register_blueprint (resource)

###############################################################################
###############################################################################
