__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, Response, request
from threading import Thread, Event

from ..app import app
from ..models import Node
from ..util import Q, jsonify
from ..ext import obj_cache
from ..ext import logger

import io
import uuid
import zlib
import cPickle as pickle

###############################################################################
###############################################################################

if app.config.get ('GEVENT'):
    import zmq.green as zmq
else:
    import zmq

###############################################################################
###############################################################################

context = zmq.Context (1)

###############################################################################
###############################################################################

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

class TimeoutError (Exception):

    pass

class PickleZlib (object):

    @staticmethod
    def send_pyobj (socket, obj, flags=0, protocol=-1):

        p = pickle.dumps (obj, protocol)
        z = zlib.compress (p)
        return socket.send (z, flags=flags)

    @staticmethod
    def recv_pyobj (socket, flags=0):

        z = socket.recv (flags)
        p = zlib.decompress (z)
        return pickle.loads (p)

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

        data = PickleZlib.recv_pyobj (self.data_socket)
        assert data
        logger.debug ('%r received data:%x' % (self, hash (data)))

        if not isinstance (data, Exception):
            self._data = data
        else:
            raise data

###############################################################################

class Worker (Thread):

    class ResourceManager (object):

        def __init__ (self, *args, **kwargs):

            self.context = kwargs ['context']
            assert context
            self.ping_address = kwargs ['ping_address']
            assert self.ping_address
            self.data_address = kwargs ['data_address']
            assert self.data_address
            self.poll_timeout = kwargs ['poll_timeout']
            assert self.poll_timeout

        def __enter__ (self):

            self.ping_socket = self.context.socket (zmq.REP)
            self.ping_socket.connect (self.ping_address)
            self.data_socket = self.context.socket (zmq.REP)
            self.data_socket.connect (self.data_address)

            self.ping_poller = zmq.Poller ()
            self.ping_poller.register (self.ping_socket, zmq.POLLIN)
            self.data_poller = zmq.Poller ()
            self.data_poller.register (self.data_socket, zmq.POLLIN)

            return self

        def __exit__ (self, exc_type, exc_val, exc_tb):

            self.ping_socket.close ()
            self.data_socket.close ()

    def __init__ (self, *args, **kwargs):

        super (Worker, self).__init__ ()

        self._args = args
        self._kwargs = kwargs
        self._do_stop = Event ()
        self._stopped = Event ()
        self.setDaemon (True)

    @property
    def stopped (self):

        return self._stopped.isSet ()

    def stop (self):

        self._do_stop.set ()

    def run (self):

        with Worker.ResourceManager (*self._args, **self._kwargs) as resource:
            while not self._do_stop.isSet ():

                self._do_ping (resource)
                self._do_data (resource)

            self._stopped.set ()

    def _do_ping (self, resource):

        if resource.ping_poller.poll (resource.poll_timeout):

            ping = resource.ping_socket.recv ()
            resource.ping_socket.send (ping)

    def _do_data (self, resource):

        if resource.data_poller.poll (resource.poll_timeout):
            data = resource.data_socket.recv ()

            try:
                data = self._process (data)
            except Exception, ex:
                data = ex

            PickleZlib.send_pyobj (resource.data_socket, data)

    def _process (self, data):

        import base64
        return base64.encodestring (data)

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
