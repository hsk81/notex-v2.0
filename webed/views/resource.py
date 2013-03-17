__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, make_response
from ..app import app
import os

###############################################################################
###############################################################################

resource = Blueprint ('resource', __name__)

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
