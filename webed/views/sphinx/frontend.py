__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint, request, make_response, send_from_directory

from ...app import app
from ...ext import logger
from ...ext import obj_cache
from ...models import Node
from ...util import Q, PickleZlib, jsonify
from ..io import compress

import uuid
import os.path
import zipfile
import tempfile
import cStringIO as StringIO

###############################################################################
###############################################################################

sphinx = Blueprint ('sphinx', __name__)

###############################################################################
###############################################################################

@sphinx.route ('/rest-to-epub/<uuid>', methods=['GET', 'POST'])
def rest_to_epub (uuid):
    return rest_to (uuid, ext='zip', converter_cls=EpubConverter)

@sphinx.route ('/rest-to-html/<uuid>', methods=['GET', 'POST'])
def rest_to_html (uuid):
    return rest_to (uuid, ext='zip', converter_cls=HtmlConverter)

@sphinx.route ('/rest-to-latex/<uuid>', methods=['GET', 'POST'])
def rest_to_latex (uuid):
    return rest_to (uuid, ext='zip', converter_cls=LatexConverter)

@sphinx.route ('/rest-to-pdf/<uuid>', methods=['GET', 'POST'])
def rest_to_pdf (uuid):
    return rest_to (uuid, ext='pdf', converter_cls=PdfConverter)

@sphinx.route ('/rest-to-text/<uuid>', methods=['GET', 'POST'])
def rest_to_text (uuid):
    return rest_to (uuid, ext='txt', converter_cls=TextConverter)

def rest_to (uuid, ext, converter_cls):

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    node = Q (base.subnodes).one (uuid=uuid)

    ping_timeout = app.config['PING_TIMEOUT']
    assert ping_timeout
    ping_address = app.config['PING_ADDRESS']
    assert ping_address
    data_address = app.config['DATA_ADDRESS']
    assert data_address

    data_key = obj_cache.make_key (uuid, 'data', converter_cls)
    size_key = obj_cache.make_key (uuid, 'size', converter_cls)

    if obj_cache.exists (data_key):
        if request.args.get ('fetch', False) and app.dev:

            with tempfile.NamedTemporaryFile (delete=False) as temp:
                temp.write (obj_cache.get (data_key))
                path, filename = os.path.split (temp.name)

            response = send_from_directory (path, filename, as_attachment=True,
                attachment_filename=filename_for (node, ext, converter_cls),
                mimetype='application/octet-stream')

        elif request.args.get ('fetch', False):

            content_disposition = 'attachment;filename="%s"' % \
                filename_for (node, ext, converter_cls)

            response = make_response ()
            response.headers['Content-Disposition'] = content_disposition
            response.headers['Content-Length'] = obj_cache.get_value (size_key)
            response.headers['Content-Type'] = 'application/octet-stream'
            response.headers['X-Accel-Redirect'] = \
                '/cache/?' + obj_cache.prefix_key (data_key)
        else:
            response = jsonify (success=True, name=node.name)
    else:
        try:
            with converter_cls (ping_address, data_address, ping_timeout) as c:
                data = c.apply (node)
                obj_cache.set_value (data_key, data, expiry=15) ##[s]
                size = len (data)
                obj_cache.set_value (size_key, size, expiry=15) ##[s]

                response = jsonify (success=True, name=node.name)
        except TimeoutError:
            response = jsonify (success=False, name=node.name), 503
        except MetaError, ex:
            response = jsonify (success=False, name=node.name, meta=ex.meta), \
                       513 ## webed specific error

    return response

def filename_for (node, ext, converter_cls):

    nodename = node.name.encode ('utf-8')
    assert nodename

    if issubclass (converter_cls, HtmlConverter):
        filename = '%s [html]' % nodename
    elif issubclass (converter_cls, LatexConverter):
        filename = '%s [latex]' % nodename
    elif issubclass (converter_cls, EpubConverter):
        filename = '%s [epub]' % nodename
    else:
        filename = '%s' % nodename

    return '%s.%s' % (filename, ext)

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

        if isinstance (payload, Exception):
            raise MetaError (payload) if hasattr (payload, '_meta') \
                else payload

        self._data = payload

class EpubConverter (Converter):

    def _do_data (self, node, prefix='epub'):
        super (EpubConverter, self)._do_data (node, prefix=prefix)

class HtmlConverter (Converter):

    def _do_data (self, node, prefix='html'):
        super (HtmlConverter, self)._do_data (node, prefix=prefix)

class LatexConverter (Converter):

    def _do_data (self, node, prefix='latex'):
        super (LatexConverter, self)._do_data (node, prefix=prefix)

class PdfConverter (Converter):

    def _do_data (self, node, prefix='pdf'):
        super (PdfConverter, self)._do_data (node, prefix=prefix)

        str_buffer = StringIO.StringIO (self._data)
        zip_buffer = zipfile.ZipFile (str_buffer, 'r', zipfile.ZIP_STORED)
        object_vals = [zip_buffer.read (zi) for zi in zip_buffer.infolist ()
            if zi.filename.endswith ('pdf')]
        zip_buffer.close ()

        self._data = object_vals.pop (0)

class TextConverter (Converter):

    def _do_data (self, node, prefix='text'):
        super (TextConverter, self)._do_data (node, prefix=prefix)

        str_buffer = StringIO.StringIO (self._data)
        zip_buffer = zipfile.ZipFile (str_buffer, 'r', zipfile.ZIP_STORED)
        object_vals = [zip_buffer.read (zi) for zi in zip_buffer.infolist ()
            if zi.filename.endswith ('txt')]
        zip_buffer.close ()

        self._data = object_vals.pop (0)

###############################################################################
###############################################################################

class MetaError (Exception):

    @property
    def meta (self):
        if len (self.args) > 0 and hasattr (self.args[0], '_meta'):
            return self.args[0]._meta
        else:
            return None

class TimeoutError (Exception): pass

###############################################################################
###############################################################################

app.register_blueprint (sphinx)

###############################################################################
###############################################################################
