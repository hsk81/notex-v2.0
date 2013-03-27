#!bin/python

###############################################################################
###############################################################################

from datetime import datetime
import base64

from flask.ext.script import Manager, Command, Option
import zmq

from webed.app import app
from webed.views import sphinx

###############################################################################
###############################################################################

context = zmq.Context (1)

###############################################################################
###############################################################################

manager = Manager (app)

###############################################################################
###############################################################################

class ZmqPing (Command):
    """ZMQ Ping: Sends a request message"""

    def get_options (self):

        return [
            Option ('-n', '--number', dest='number', default=1, type=int),
            Option ('-m', '--message', dest='message', default='PING'),
            Option ('-a', '--address', dest='address', default=
                'tcp://localhost:8080'),
        ]

    def run (self, *args, **kwargs):

        number = kwargs['number']
        assert number
        message = kwargs['message']
        assert message
        address = kwargs['address']
        assert address

        sock = context.socket (zmq.REQ)
        sock.connect (address)

        for n in range (number):

            try:
                timestamp = datetime.now ()
                sock.send (message)
                print '[%s] %s' % (timestamp, sock.recv ())

            except KeyboardInterrupt:
                break

manager.add_command ('ping', ZmqPing ())

###############################################################################
###############################################################################

class ZmqEcho (Command):
    """ZMQ Echo: Responds with an echo message to a request"""

    def get_options (self):

        return [
            Option ('-b64', '--base64', dest='base64', action='store_true'),
            Option ('-a', '--address', dest='address', default=
                'tcp://localhost:8181'),
        ]

    def run (self, *args, **kwargs):

        context = zmq.Context (1)

        b64flag = kwargs['base64']
        address = kwargs['address']
        assert address

        sock = context.socket (zmq.REP)
        sock.connect (address)

        while True:

            try:
                message = sock.recv()
                sock.send (message)

                print '[%s] %s' % (
                    datetime.now (), base64.encodestring (message)
                        if b64flag else message)

            except KeyboardInterrupt:
                break

manager.add_command ('echo', ZmqEcho ())

###############################################################################
###############################################################################

class ZmqQueue (Command):
    """ZMQ Queue: Connects frontend clients with backend services"""

    def get_options (self):

        return [
            Option ('-f', '--frontend-address', dest='frontend-address',
                    default='tcp://*:8080'),
            Option ('-b', '--backend-address', dest='backend-address',
                    default='tcp://*:8181'),
        ]

    def run (self, *args, **kwargs):

        frontend_address = kwargs['frontend-address']
        assert frontend_address
        backend_address = kwargs['backend-address']
        assert backend_address

        context = zmq.Context (1)

        frontend = context.socket (zmq.ROUTER)
        frontend.bind (frontend_address)
        backend = context.socket (zmq.DEALER)
        backend.bind (backend_address)

        try:
            zmq.device (zmq.QUEUE, frontend, backend)
        except KeyboardInterrupt:
            pass

class ZmqPingQueue (ZmqQueue):
    """ZMQ Ping Queue: Connects frontend clients with backend services"""

    def get_options (self):

        return [
            Option ('-f', '--frontend-address', dest='frontend-address',
                    default='tcp://*:7070'),
            Option ('-b', '--backend-address', dest='backend-address',
                    default='tcp://*:7171'),
        ]

class ZmqDataQueue (ZmqQueue):
    """ZMQ Data Queue: Connects frontend clients with backend services"""

    def get_options (self):

        return [
            Option ('-f', '--frontend-address', dest='frontend-address',
                    default='tcp://*:9090'),
            Option ('-b', '--backend-address', dest='backend-address',
                    default='tcp://*:9191'),
        ]

manager.add_command ('queue-ping', ZmqPingQueue ())
manager.add_command ('queue-data', ZmqDataQueue ())

###############################################################################
###############################################################################

class ZmqSphinx (Command):
    """Sphinx: Converts projects to reports (PDF, HTML or LaTex)"""

    def get_options (self):

        return [
            Option ('-p', '--ping-address', dest='ping-address',
                    default='tcp://localhost:7171'),
            Option ('-d', '--data-address', dest='data-address',
                    default='tcp://localhost:9191'),
        ]

    def run (self, *args, **kwargs):

        ping_address = kwargs['ping-address']
        assert ping_address
        data_address = kwargs['data-address']
        assert data_address
        data_timeout = app.config['DATA_TIMEOUT']
        assert data_timeout

        context = zmq.Context (1)

        args = [context, ping_address, data_address, data_timeout]
        with sphinx.Worker (*args) as worker: worker.run ()

manager.add_command ('sphinx', ZmqSphinx ())

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
