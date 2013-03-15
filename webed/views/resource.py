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

@resource.route ('/all-classes.js', methods=['GET'])
def all_classes (path='webed/static/all-classes.js'):
    return make_resource_response (path, 'text/javascript')

def make_resource_response (path, content_type):

    response = make_response (open (os.path.abspath (path)).read ())
    response.headers['Content-Type'] = content_type
    return response

###############################################################################
###############################################################################

app.register_blueprint (resource)

###############################################################################
###############################################################################
