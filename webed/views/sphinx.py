__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, Response, request

from ..app import app
from ..models import Node
from ..util import Q, JSON
from ..ext import obj_cache
from ..ext import logger

import io

###############################################################################
###############################################################################

if app.config.get ('GEVENT'):
    import zmq.green as zmq
else:
    import zmq

context = zmq.Context (1)

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

    aid = '%s' % hash (app)

    ping_address = app.config['PING_ADDRESS']
    assert ping_address
    data_address = app.config['DATA_ADDRESS']
    assert data_address

    ping_socket = context.socket (zmq.REQ)
    ping_socket.connect (ping_address)
    data_socket = context.socket (zmq.REQ)
    data_socket.connect (data_address)

    ping = b'PING'
    ping_socket.send (b'PING')
    logger.debug ('[APPID:%s] send-ing %s' % (aid, ping))

    pong = ping_socket.recv ()
    assert pong == ping
    logger.debug ('[APPID:%s] received %s' % (aid, pong))

    data = io.compress (node)
    data_socket.send (data)
    logger.debug ('[APPID:%s] send-ing data:%s' % (aid, hash (data)))

    data = data_socket.recv_pyobj ()
    assert data
    logger.debug ('[APPID:%s] received data:%s' % (aid, hash (data)))

    if isinstance (data, Exception):
        raise data
    return data

def worker (wid, ping_socket, data_socket):

    ping = ping_socket.recv ()
    logger.debug ('[SPX-W:%s] received %s' % (wid, ping))
    ping_socket.send (ping)
    logger.debug ('[SPX-W:%s] send-ing %s' % (wid, ping))

    data = data_socket.recv ()
    logger.debug ('[SPX-W:%s] received data:%s' % (wid, hash (data)))

    try:
        data = worker_convert (data)
    except Exception, ex:
        logger.exception (ex)
        data = ex

    data_socket.send_pyobj (data)
    logger.debug ('[SPX-W:%s] send-ing data:%s' % (wid, hash (data)))

def worker_convert (data):

    import base64
    return base64.encodestring (data)

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
