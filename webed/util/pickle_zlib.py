__author__ = 'hsk81'

###############################################################################
###############################################################################

import zlib
import cPickle as pickle

###############################################################################
###############################################################################

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
