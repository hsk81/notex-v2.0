__author__ = 'hsk81'

###############################################################################
###############################################################################

import uuid

from flask import Blueprint, Response, request

from ..app import app
from ..models import Node
from ..util import Q, jsonify
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

ping_timeout = app.config['PING_TIMEOUT']
assert ping_timeout
ping_address = app.config['PING_ADDRESS']
assert ping_address
data_address = app.config['DATA_ADDRESS']
assert data_address

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
            response = jsonify (success=True, name=node.name)
            obj_cache.expire (archive_key, expiry=15) ## refresh
    else:
        try:
            args = [context, ping_address, data_address, ping_timeout]
            with Converter (*args) as converter: value = converter.apply (node)
            obj_cache.set_value (archive_key, value, expiry=15) ##[s]
            response = jsonify (success=True, name=node.name)
        except TimeoutError:
            response = jsonify (success=False, name=node.name), 503

    return response

###############################################################################
###############################################################################

class Converter (object):

    def __init__ (self, context, ping_address, data_address, ping_timeout):

        self.context = context
        assert context
        self.ping_timeout = ping_timeout
        assert self.ping_timeout
        self.ping_address = ping_address
        assert self.ping_address
        self.data_address = data_address
        assert self.data_address

    def __enter__ (self):

        self.ping_socket = self.context.socket (zmq.REQ)
        self.ping_socket.connect (self.ping_address)
        self.data_socket = self.context.socket (zmq.REQ)
        self.data_socket.connect (self.data_address)

        self.ping_poller = zmq.Poller ()
        self.ping_poller.register (self.ping_socket, zmq.POLLIN)

        return self

    def __exit__ (self, exc_type, exc_val, exc_tb):

        self.ping_socket.close ()
        self.data_socket.close ()

    def apply (self, node):

        self._do_ping ()
        self._do_data (node)

        return self._data

    def _do_ping (self):

        ping = b'ping:%x' % hash (uuid.uuid4 ())
        self.ping_socket.send (ping)
        logger.debug ('%r send-ing %s' % (self, ping))

        if not self.ping_poller.poll (self.ping_timeout):
            raise TimeoutError ('timeout at %s' % self.ping_address)

        pong = self.ping_socket.recv ()
        assert pong == ping
        logger.debug ('%r received %s' % (self, pong))

    def _do_data (self, node):

        data = io.compress (node)
        self.data_socket.send (data)
        logger.debug ('%r send-ing data:%x' % (self, hash (data)))

        data = self.data_socket.recv_pyobj ()
        assert data
        logger.debug ('%r received data:%x' % (self, hash (data)))

        if not isinstance (data, Exception):
            self._data = data
        else:
            raise data

###############################################################################

class Worker (object):

    def __init__ (self, context, ping_address, data_address, data_timeout):

        self.context = context
        assert context
        self.ping_address = ping_address
        assert self.ping_address
        self.data_address = data_address
        assert self.data_address
        self.data_timeout = data_timeout
        assert self.data_timeout

    def __enter__ (self):

        self.ping_socket = self.context.socket (zmq.REP)
        self.ping_socket.connect (self.ping_address)
        self.data_socket = self.context.socket (zmq.REP)
        self.data_socket.connect (self.data_address)

        self.data_poller = zmq.Poller ()
        self.data_poller.register (self.data_socket, zmq.POLLIN)

        return self

    def __exit__ (self, exc_type, exc_val, exc_tb):

        self.ping_socket.close ()
        self.data_socket.close ()

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

class TimeoutError (Exception): pass

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
