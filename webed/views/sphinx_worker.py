__author__ = 'hsk81'

###############################################################################
###############################################################################

from threading import Thread, Event
import zlib
import cPickle as pickle

import zmq

###############################################################################
###############################################################################

context = zmq.Context (1)

###############################################################################
###############################################################################

class Worker (Thread):

    class ResourceManager (object):

        def __init__ (self, *args, **kwargs):

            self.ping_address = kwargs ['ping_address']
            assert self.ping_address
            self.data_address = kwargs ['data_address']
            assert self.data_address
            self.poll_timeout = kwargs ['poll_timeout']
            assert self.poll_timeout

        def __enter__ (self):

            self.ping_socket = context.socket (zmq.REP)
            self.ping_socket.connect (self.ping_address)
            self.data_socket = context.socket (zmq.REP)
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

class PickleZlib (object):

    @staticmethod
    def send_pyobj (socket, obj, flags=0, protocol=-1):

        p = pickle.dumps (obj, protocol)
        z = zlib.compress (p)
        return socket.send (z, flags=flags)

###############################################################################
###############################################################################
