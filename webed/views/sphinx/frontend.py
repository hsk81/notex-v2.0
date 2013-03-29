__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, Response, request

from ...app import app
from ...ext import logger
from ...ext import obj_cache
from ...models import Node
from ...util import Q, PickleZlib, jsonify
from ..io import compress

import uuid

###############################################################################
###############################################################################

sphinx = Blueprint ('sphinx', __name__)

###############################################################################
###############################################################################

@sphinx.route ('/rest-to-html/', methods=['GET', 'POST'])
def rest_to_html ():
    return rest_to (ext='zip', converter_cls=HtmlConverter)

@sphinx.route ('/rest-to-latex/', methods=['GET', 'POST'])
def rest_to_latex ():
    return rest_to (ext='zip', converter_cls=LatexConverter)

@sphinx.route ('/rest-to-pdf/', methods=['GET', 'POST'])
def rest_to_pdf ():
    return rest_to (ext='pdf', converter_cls=PdfConverter)

def rest_to (ext, converter_cls, chunk_size=256 * 1024):

    node_uuid = request.args.get ('node_uuid', None)
    assert node_uuid
    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    node = Q (base.subnodes).one (uuid=node_uuid)
    assert node

    ping_timeout = app.config['PING_TIMEOUT']
    assert ping_timeout
    ping_address = app.config['PING_ADDRESS']
    assert ping_address
    data_address = app.config['DATA_ADDRESS']
    assert data_address

    archive_key = obj_cache.make_key (node_uuid, converter_cls)
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
            response.headers ['Content-Disposition'] = filename_for (
                ext, converter_cls, node)
        else:
            response = jsonify (success=True, name=node.name)
            obj_cache.expire (archive_key, expiry=15) ## refresh
    else:
        try:
            with converter_cls (ping_address, data_address, ping_timeout) as c:
                obj_cache.set_value (archive_key, c.apply (node), expiry=15)
                response = jsonify (success=True, name=node.name)
        except TimeoutError:
            response = jsonify (success=False, name=node.name), 503

    return response

def filename_for (ext, converter_cls, node):

    nodename = node.name.encode ('utf-8')
    assert nodename

    if issubclass (converter_cls, HtmlConverter):
        filename = '%s [html]' % nodename
    elif issubclass (converter_cls, LatexConverter):
        filename = '%s [latex]' % nodename
    else:
        filename = '%s' % nodename

    return 'attachment;filename="%s.%s"' % (filename, ext)

###############################################################################
###############################################################################

class Converter (object):

    @classmethod
    def import_zmq (cls, app):

        if hasattr (cls, 'zmq'):
            return getattr (cls, 'zmq')

        if app.config.get ('GEVENT'):
            import zmq.green as zmq
        else:
            import zmq

        setattr (cls, 'zmq', zmq)
        return zmq

    def __init__ (self, ping_address, data_address, ping_timeout):

        self.ping_timeout = ping_timeout
        assert self.ping_timeout
        self.ping_address = ping_address
        assert self.ping_address
        self.data_address = data_address
        assert self.data_address

    def __enter__ (self):

        zmq = self.import_zmq (app)
        context = zmq.Context (1)

        self.ping_socket = context.socket (zmq.REQ)
        self.ping_socket.connect (self.ping_address)
        self.ping_socket.LINGER = 0
        self.data_socket = context.socket (zmq.REQ)
        self.data_socket.connect (self.data_address)
        self.data_socket.LINGER = 0

        self.ping_poller = zmq.Poller ()
        self.ping_poller.register (self.ping_socket, zmq.POLLIN)

        return self

    def __exit__ (self, *args, **kwargs):

        self.ping_socket.close ()
        self.data_socket.close ()

    def apply (self, node):

        self._do_ping ()
        self._do_data (node)

        return self._data

    def _do_ping (self):

        ping = b'%x' % hash (uuid.uuid4 ())
        self.ping_socket.send (ping)
        logger.debug ('%r send-ing ping:%s' % (self, ping))

        if not self.ping_poller.poll (self.ping_timeout):
            raise TimeoutError ('timeout at %s' % self.ping_address)

        pong = self.ping_socket.recv ()
        assert pong == ping
        logger.debug ('%r received ping:%s' % (self, pong))

    def _do_data (self, node, prefix=None):

        payload = compress (node, crlf=False)
        self.data_socket.send ((prefix + '-' + payload) if prefix else payload)
        logger.debug ('%r send-ing data:%x' % (self, hash (payload)))

        payload = PickleZlib.recv_pyobj (self.data_socket)
        assert payload
        logger.debug ('%r received data:%x' % (self, hash (payload)))

        if isinstance (payload, Exception): raise payload
        self._data = payload

class HtmlConverter (Converter):

    def _do_data (self, node, prefix='html'):
        super (HtmlConverter, self)._do_data (node, prefix=prefix)

class LatexConverter (Converter):

    def _do_data (self, node, prefix='latex'):
        super (LatexConverter, self)._do_data (node, prefix=prefix)

class PdfConverter (Converter):

    def _do_data (self, node, prefix='pdf'):
        super (PdfConverter, self)._do_data (node, prefix=prefix)

###############################################################################
###############################################################################

class TimeoutError (Exception):

    pass

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
