#!bin/python

###############################################################################
###############################################################################

from flask.ext.script import Manager, Command, Option
from zmq.devices import ThreadDevice
from datetime import datetime

from webed.app import app
from webed.views import sphinx

import zmq
import base64
import select

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

manager.add_command ('zmq-ping', ZmqPing ())

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

manager.add_command ('zmq-echo', ZmqEcho ())

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

        frontend = context.socket (zmq.ROUTER)
        frontend.bind (frontend_address)
        backend = context.socket (zmq.DEALER)
        backend.bind (backend_address)

        try:
            zmq.device (zmq.QUEUE, frontend, backend)
        except KeyboardInterrupt:
            pass

class ZmqQueueThread (ZmqQueue):
    """ZMQ Q-Thread: Connects frontend clients with backend services"""

    def run (self, *args, **kwargs):

        frontend_address = kwargs['frontend-address']
        assert frontend_address
        backend_address = kwargs['backend-address']
        assert backend_address

        device = ThreadDevice (zmq.QUEUE, zmq.REP, zmq.REQ)
        device.bind_in (frontend_address)
        device.bind_out (backend_address)
        device.start ()

class PingQueue (ZmqQueue):
    """Ping Queue: Connects frontend clients with backend services"""

    def get_options (self):

        return [
            Option ('-pfa', '--ping-frontend-address',
                    dest='ping-frontend-address',
                    default='tcp://*:7070'),
            Option ('-pba', '--ping-backend-address',
                    dest='ping-backend-address',
                    default='tcp://*:7171'),
        ]

    def run (self, *args, **kwargs):

        frontend_address = kwargs['ping-frontend-address']
        assert frontend_address
        backend_address = kwargs['ping-backend-address']
        assert backend_address

        kwargs['frontend-address'] = frontend_address
        kwargs['backend-address'] = backend_address

        super (PingQueue, self).run (*args, **kwargs)

class PingQueueThread (PingQueue, ZmqQueueThread):
    """Ping Q-Thread: Connects frontend clients with backend services"""

    def run (self, *args, **kwargs):

        super (PingQueueThread, self).run (*args, **kwargs)

class DataQueue (ZmqQueue):
    """Data Queue: Connects frontend clients with backend services"""

    def get_options (self):

        return [
            Option ('-dfa', '--data-frontend-address',
                    dest='data-frontend-address',
                    default='tcp://*:9090'),
            Option ('-dba', '--data-backend-address',
                    dest='data-backend-address',
                    default='tcp://*:9191'),
        ]

    def run (self, *args, **kwargs):

        frontend_address = kwargs['data-frontend-address']
        assert frontend_address
        backend_address = kwargs['data-backend-address']
        assert backend_address

        kwargs['frontend-address'] = frontend_address
        kwargs['backend-address'] = backend_address

        super (DataQueue, self).run (*args, **kwargs)

class DataQueueThread (DataQueue, ZmqQueueThread):
    """Data Q-Thread: Connects frontend clients with backend services"""

    def run (self, *args, **kwargs):

        super (DataQueueThread, self).run (*args, **kwargs)

class Queue (Command):
    """Queue: Connects frontend clients with backend services"""

    def get_options (self):

        return PingQueue ().get_options () + DataQueue ().get_options ()

    def run (self, *args, **kwargs):

        PingQueueThread ().run (*args, **kwargs)
        DataQueueThread ().run (*args, **kwargs)

        try:
            select.select ([], [], [])
        except KeyboardInterrupt:
            pass

###############################################################################

manager.add_command ('queue-ping', PingQueue ())
manager.add_command ('queue-data', DataQueue ())
manager.add_command ('queue', Queue ())

###############################################################################
###############################################################################

class Converter (Command):
    """Converter: processes projects to reports (PDF, HTML or LaTex)"""

    def get_options (self):

        return [
            Option ('-w', '--worker-threads', dest='worker-threads',
                    default=1, type=int),
            Option ('-p', '--ping-address', dest='ping-address',
                    default='tcp://localhost:7171'),
            Option ('-d', '--data-address', dest='data-address',
                    default='tcp://localhost:9191'),
        ]

    def run (self, *args, **kwargs):

        worker_threads = kwargs['worker-threads']
        assert worker_threads >= 0
        ping_address = kwargs['ping-address']
        assert ping_address
        data_address = kwargs['data-address']
        assert data_address
        poll_timeout = app.config['POLL_TIMEOUT']
        assert poll_timeout

        workers = []
        for _ in range (worker_threads):

            workers.append (sphinx.Worker (
                context=context,
                ping_address=ping_address,
                data_address=data_address,
                poll_timeout=poll_timeout
            ))

            workers[-1].start ()

        try:
            select.select ([], [], [])
        except KeyboardInterrupt:
            while any (map (lambda w: not w.stopped, workers)):
                for worker in workers: worker.stop ()

manager.add_command ('converter', Converter ())

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
