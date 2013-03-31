__author__ = 'hsk81'

###############################################################################
###############################################################################

from abc import ABCMeta, abstractmethod, abstractproperty
from uuid import uuid4 as uuid_random
from threading import Thread, Event
from subprocess import check_call

from ...app import app
from ...util import PickleZlib
from ..mime import is_text
from ..io import extract, guess_mime
from .yaml2py import yaml2py

import os
import zmq
import shutil
import zipfile
import tempfile
import cStringIO as StringIO

###############################################################################
###############################################################################

context = zmq.Context (1)

###############################################################################
###############################################################################

class Worker (Thread):

    class Logger (object):

        def __init__ (self, app):

            self.app = app

        def __getattr__ (self, attr):

            fn = getattr (self.app.logger, attr)
            if callable (fn):
                def gn (*args, **kwargs):
                    with app.test_request_context ():
                        fn (*args, **kwargs)

                return gn
            else:
                return fn

    class ResourceManager (object):

        def __init__ (self, **kwargs):

            self.ping_address = kwargs ['ping_address']
            assert self.ping_address
            self.data_address = kwargs ['data_address']
            assert self.data_address
            self.poll_timeout = kwargs ['poll_timeout']
            assert self.poll_timeout

        def __enter__ (self):

            self.ping_socket = context.socket (zmq.REP)
            self.ping_socket.connect (self.ping_address)
            self.ping_socket.LINGER = 0
            self.data_socket = context.socket (zmq.REP)
            self.data_socket.connect (self.data_address)
            self.data_socket.LINGER = 0

            self.ping_poller = zmq.Poller ()
            self.ping_poller.register (self.ping_socket, zmq.POLLIN)
            self.data_poller = zmq.Poller ()
            self.data_poller.register (self.data_socket, zmq.POLLIN)

            return self

        def __exit__ (self, *args, **kwargs):

            self.ping_socket.close ()
            self.data_socket.close ()

    def __init__ (self, **kwargs):

        super (Worker, self).__init__ ()

        self.logger = Worker.Logger (app)
        self.kwargs = kwargs
        self.do_stop = Event ()
        self.is_stopped = Event ()
        self.setDaemon (True)

    @property
    def stopped (self):

        if self.is_stopped.isSet ():
            self.logger.info ('%r stopped' % self)
            return True
        return False

    def stop (self):

        self.do_stop.set ()

    def start (self):

        super (Worker, self).start ()
        self.logger.info ('%r started' % self)

    def run (self):

        with Worker.ResourceManager (**self.kwargs) as resource:
            while not self.do_stop.isSet ():

                self._do_ping (resource)
                self._do_data (resource)

            self.is_stopped.set ()

    def _do_ping (self, resource):

        if resource.ping_poller.poll (resource.poll_timeout):

            ping = resource.ping_socket.recv ()
            self.logger.debug ('%r received ping:%s' % (self, ping))
            resource.ping_socket.send (ping)
            self.logger.debug ('%r send-ing ping:%s' % (self, ping))

    def _do_data (self, resource):

        if resource.data_poller.poll (resource.poll_timeout):

            data = resource.data_socket.recv ()
            self.logger.debug ('%r received data:%x' % (self, hash (data)))

            try:
                data = self._process (data)
            except Exception, ex:
                self.logger.exception (ex)
                data = ex

            PickleZlib.send_pyobj (resource.data_socket, data)
            self.logger.debug ('%r send-ing data:%x' % (self, hash (data)))

    def _process (self, data):

        prefix, payload = data.split ('-', 1)

        ## --------------------------------------------------------------------
        ## Copy Sphinx template from source to target path
        ## --------------------------------------------------------------------

        template_path = app.config['SPHINX_TEMPLATE_PATH']
        source_path = '00000000-0000-0000-0000-000000000000'
        source_path = os.path.join (template_path, source_path)
        assert os.path.exists (source_path)

        temp_path = app.config['SPHINX_TEMP_PATH']
        if not os.path.exists (temp_path): os.makedirs (temp_path)
        assert os.path.exists (temp_path)
        target_path = os.path.join (temp_path, str (uuid_random()))

        shutil.copytree (source_path, target_path)

        ## --------------------------------------------------------------------
        ## Extract project files to target (sub-)path
        ## --------------------------------------------------------------------

        target_subpath = os.path.join (target_path, 'source')
        assert os.path.exists (target_subpath)

        with tempfile.TemporaryFile () as zip_file:

            zip_file.write (payload)
            zip_file.flush ()

            extract (zip_file, path=target_subpath)

        title = 'project'
        for dirpath, dirnames, filenames in os.walk (target_subpath):

            if dirpath == target_subpath:
                continue

            for filename in filenames:
                shutil.move (os.path.join (dirpath, filename), target_subpath)
            for dirname in dirnames:
                shutil.move (os.path.join (dirpath, dirname), target_subpath)

            os.rmdir (dirpath); _, title = os.path.split (dirpath)

        ## --------------------------------------------------------------------
        ## Create Sphinx configuration from YAML file
        ## --------------------------------------------------------------------

        latex_backend = 'xelatex'
        for dirpath, dirnames, filenames in os.walk (target_subpath):

            yaml_path = None
            for filename in filenames:
                if guess_mime (filename) == 'text/x-yaml':
                    yaml_path = os.path.join (dirpath, filename)
                    latex_backend = yaml2py (yaml_path, dirpath)
                    break

            if yaml_path:
                break

        if latex_backend not in ['xelatex', 'pdflatex']:
            latex_backend = 'xelatex' ## security!

        ## --------------------------------------------------------------------
        ## Invoke PDF, LaTex or HTML conversion & ZIP package result
        ## --------------------------------------------------------------------

        if prefix == 'html':
            converter = HtmlConverter (target_path)
            converter.translate ()

        elif prefix == 'latex':
            converter = LatexConverter (target_path, latex_backend)
            converter.translate (source_path)

        else:
            converter = LatexConverter (target_path, latex_backend)
            converter.translate (source_path)
            converter = PdfConverter (target_path, latex_backend)
            converter.translate (source_path)

        payload = converter.pack (title)

        ## --------------------------------------------------------------------
        ## Cleanup `source-path` in production environment
        ## --------------------------------------------------------------------

        if not app.dev:
            shutil.rmtree (target_path, ignore_errors=True)

        return payload

###############################################################################
###############################################################################

class Converter (object):
    __metaclass__ = ABCMeta

    @abstractproperty
    def build_path (self):
        return os.path.join (self.target_path, 'build')

    def __init__ (self, target_path):

        self.target_path = target_path
        self.stdout_path = os.path.join (self.target_path, 'stdout.log')
        self.stderr_path = os.path.join (self.target_path, 'stderr.log')

    @abstractmethod
    def translate (self, source_path):
        pass

    def pack (self, title):

        str_buffer = StringIO.StringIO ()
        zip_buffer = zipfile.ZipFile (str_buffer, 'w', zipfile.ZIP_DEFLATED)

        self.fill_buffer (zip_buffer, title=title.encode ('utf-8'))

        zip_buffer.close ()
        data = str_buffer.getvalue ()
        str_buffer.close ()

        return data

    @abstractmethod
    def fill_buffer (self, zip_buffer, title):
        pass

###############################################################################
###############################################################################

class HtmlConverter (Converter):

    @property
    def build_path (self):
        return os.path.join (self.target_path, 'build', 'html')

    def translate (self, source_path=None):

        args = ['make', '-C', self.target_path, 'html']

        with open (self.stdout_path, 'w') as stdout:
            with open (self.stderr_path, 'w') as stderr:
                check_call (args, stdout=stdout, stderr=stderr)

    def fill_buffer (self, zip_buffer, title):

        for path, dns, fns in os.walk (self.build_path):
            for filename in fns:
                src_path = os.path.join (path, filename)

                mime = guess_mime (filename)
                with app.test_request_context ():
                    text = mime and is_text (mime)
                if text:
                    with open (src_path, 'r') as src_file:
                        src_text = src_file.read ()
                    with open (src_path, 'w') as src_file:
                        src_file.write (src_text.replace ('\n', '\r\n'))

                rel_path = os.path.relpath (path, self.build_path)
                zip_path = os.path.join (title, 'html', rel_path, filename)
                zip_buffer.write (src_path, zip_path)

###############################################################################
###############################################################################

class LatexConverter (Converter):

    @property
    def build_path (self):
        return os.path.join (self.target_path, 'build', 'latex')

    def __init__ (self, target_path, latex_backend):

        super (LatexConverter, self).__init__ (target_path)
        self.latex_backend = latex_backend

    def translate (self, source_path):

        args = ['make', '-C', self.target_path, 'latex']

        with open (self.stdout_path, 'w') as stdout:
            with open (self.stderr_path, 'w') as stderr:
                check_call (args, stdout=stdout, stderr=stderr)

        shutil.copy (
            os.path.join (source_path, 'build', 'latex', 'sphinxhowto.cls'),
            os.path.join (self.build_path, 'sphinxhowto.cls'))

        shutil.copy (
            os.path.join (source_path, 'build', 'latex', 'sphinxmanual.cls'),
            os.path.join (self.build_path, 'sphinxmanual.cls'))

        shutil.copy (
            os.path.join (source_path, 'build', 'latex', 'Makefile'),
            os.path.join (self.build_path, 'Makefile'))

    def fill_buffer (self, zip_buffer, title):

        for path, dns, fns in os.walk (self.build_path):
            for filename in filter (lambda fn: not fn.endswith ('pdf'), fns):
                src_path = os.path.join (path, filename)

                mime = guess_mime (filename)
                with app.test_request_context ():
                    text = mime and is_text (mime)
                if text:
                    with open (src_path, 'r') as src_file:
                        src_text = src_file.read ()
                    with open (src_path, 'w') as src_file:
                        src_file.write (src_text.replace ('\n', '\r\n'))

                rel_path = os.path.relpath (path, self.build_path)
                zip_path = os.path.join (title, 'latex', rel_path, filename)
                zip_buffer.write (src_path, zip_path)

###############################################################################
###############################################################################

class PdfConverter (Converter):

    @property
    def build_path (self):
        return os.path.join (self.target_path, 'build', 'latex')

    def __init__ (self, target_path, latex_backend):

        super (PdfConverter, self).__init__ (target_path)
        self.latex_backend = latex_backend

    def translate (self, source_path):

        LATEXEXEC = 'LATEXEXEC=%s' % self.latex_backend
        LATEXOPTS = 'LATEXOPTS=%s' % '-no-shell-escape -halt-on-error'
        args = ['make', '-C', self.build_path, 'all-pdf', LATEXEXEC, LATEXOPTS]

        with open (self.stdout_path, 'w') as stdout:
            with open (self.stderr_path, 'w') as stderr:
                check_call (args, stdout=stdout, stderr=stderr)

    def fill_buffer (self, zip_buffer, title):

        for path, dns, fns in os.walk (self.build_path):
            for filename in filter (lambda fn: fn.endswith ('pdf'), fns):

                src_path = os.path.join (path, filename)
                zip_path = os.path.join (title, 'pdf', '%s.pdf' % title)
                zip_buffer.write (src_path, zip_path)

###############################################################################
###############################################################################
