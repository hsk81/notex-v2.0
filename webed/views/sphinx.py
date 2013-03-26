__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, Response, request
from .io import compress

from ..app import app
from ..models import Node
from ..util import Q, JSON
from ..ext import obj_cache

if app.config.get ('GEVENT'):
    import zmq.green as zmq
else:
    import zmq

###############################################################################
###############################################################################

sphinx = Blueprint ('sphinx', __name__)

###############################################################################
###############################################################################

@sphinx.route ('/rest-to-latex/', methods=['GET', 'POST'])
def rest_to_latex (chunk_size=256 * 1024):

    pass ## TODO!

@sphinx.route ('/rest-to-html/', methods=['GET', 'POST'])
def rest_to_html (chunk_size=256 * 1024):

    pass ## TODO!

@sphinx.route ('/rest-to-pdf/', methods=['GET', 'POST'])
def rest_to_pdf (chunk_size=256 * 1024):

    node_uuid = request.args.get ('node_uuid', None)
    assert node_uuid
    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    node = Q (base.subnodes).one (uuid=node_uuid)
    assert node

    archive_key = obj_cache.make_key (node_uuid, 'rest2pdf')
    content_val = obj_cache.get_value (archive_key)

    if content_val:
        if request.args.get ('fetch', False):

            content_len = len (content_val)
            content_csz = chunk_size

            def next_chunk (length, size):
                for index in range (0, length, size):
                    yield content_val[index:index + size]

            response = Response (next_chunk (content_len, content_csz))
            response.headers ['Content-Length'] = content_len
            response.headers ['Content-Disposition'] = \
                'attachment;filename="%s.pdf"' % node.name.encode ('utf-8')
        else:
            response = JSON.encode (dict (success=True, name=node.name))
            obj_cache.expire (archive_key, expiry=90) ## refresh
    else:
        response = JSON.encode (dict (success=True, name=node.name))
        obj_cache.set_value (archive_key, convert (node), expiry=90) ##[s]

    return response

###############################################################################
###############################################################################

def convert (node):

    ping_address = 'tcp://localhost:7070'
    data_address = 'tcp://localhost:9090'

    context = zmq.Context (1)
    ping_socket = context.socket (zmq.REQ)
    ping_socket.connect (ping_address)
    data_socket = context.socket (zmq.REQ)
    data_socket.connect (data_address)

    ping_socket.send (b'PING')
    assert b'PING' == ping_socket.recv ()

    data_socket.send (compress (node))
    return data_socket.recv ()

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
