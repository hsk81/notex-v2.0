__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, Response, request

from ..app import app
from ..models import Node
from ..util import Q, jsonify
from ..ext import obj_cache
from ..ext import logger

import io
import uuid

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

class TimeoutError (Exception): pass

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
            response = jsonify (success=True, name=node.name)
            obj_cache.expire (archive_key, expiry=15) ## refresh
    else:
        try:
            obj_cache.set_value (archive_key, convert (node), expiry=15) ##[s]
            response = jsonify (success=True, name=node.name)
        except TimeoutError:
            response = jsonify (success=False, name=node.name), 503

    return response

###############################################################################
###############################################################################

def convert (node):
    aid = '%x' % hash (app)

    ping_timeout = app.config['PING_TIMEOUT']
    assert ping_timeout
    ping_address = app.config['PING_ADDRESS']
    assert ping_address
    data_address = app.config['DATA_ADDRESS']
    assert data_address

    ## ========================================================================
    ## Ping & pong: check worker availability
    ## ========================================================================

    ping_socket = context.socket (zmq.REQ)
    ping_socket.connect (ping_address)
    ping_socket.setsockopt (zmq.LINGER, 0)

    ping = b'ping:%x' % hash (uuid.uuid4 ())
    ping_socket.send (ping)
    logger.debug ('[APPID:%s] send-ing %s' % (aid, ping))

    ping_poller = zmq.Poller ()
    ping_poller.register (ping_socket, zmq.POLLIN)
    if not ping_poller.poll (ping_timeout):
        raise TimeoutError ('timeout at %s' % ping_address)

    pong = ping_socket.recv ()
    assert pong == ping
    logger.debug ('[APPID:%s] received %s' % (aid, pong))

    ## ========================================================================
    ## Data transfer: Send compressed data & receive python object
    ## ========================================================================

    data_socket = context.socket (zmq.REQ)
    data_socket.connect (data_address)

    data = io.compress (node)
    data_socket.send (data)
    logger.debug ('[APPID:%s] send-ing data:%x' % (aid, hash (data)))

    data = data_socket.recv_pyobj ()
    assert data
    logger.debug ('[APPID:%s] received data:%x' % (aid, hash (data)))

    ## ========================================================================
    ## Cleanup: Ensure that sockets are closed properly
    ## ========================================================================

    ping_socket.close ()
    data_socket.close ()

    if isinstance (data, Exception):
        raise data
    return data

###############################################################################
###############################################################################

class Worker (object):

    def __init__ (self, ping_address, data_address):

        self.ping_address = ping_address
        assert self.ping_address
        self.data_address = data_address
        assert self.data_address
        self.data_timeout = app.config['DATA_TIMEOUT']
        assert self.data_timeout

    def start (self):

        self.ping_socket = context.socket (zmq.REP)
        self.ping_socket.connect (self.ping_address)
        self.data_socket = context.socket (zmq.REP)
        self.data_socket.connect (self.data_address)
        self.data_poller = zmq.Poller ()
        self.data_poller.register (self.data_socket, zmq.POLLIN)

        self.run ()

    def run (self):

        while True:
            try:
                self._do_ping ()
                self._do_data ()
            except KeyboardInterrupt:
                break

    def _do_ping (self):

        ping = self.ping_socket.recv ()
        logger.debug ('%r received %s' % (self, ping))
        self.ping_socket.send (ping)
        logger.debug ('%r send-ing %s' % (self, ping))

    def _do_data (self):

        if not self.data_poller.poll (self.data_timeout):
            error = TimeoutError ('timeout at %s' % self.data_address)
            logger.exception (error)
            return ## no data!

        data = self.data_socket.recv ()
        logger.debug ('%r received data:%x' % (self, hash (data)))

        try:
            data = self._process (data)
        except Exception, ex:
            logger.exception (ex)
            data = ex

        self.data_socket.send_pyobj (data)
        logger.debug ('%r send-ing data:%x' % (self, hash (data)))

    def _process (self, data):

        import base64
        return base64.encodestring (data)

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
