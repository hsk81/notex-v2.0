__author__ = 'hsk81'

###############################################################################
###############################################################################

import zlib
import cPickle as pickle

###############################################################################
###############################################################################

class WrapException (Exception):

    def __init__ (self, *args, **kwargs):

        args = list (args)
        if not len (args) > 0: return
        ex = args.pop (0)
        assert isinstance (ex, Exception)

        args = list (getattr (ex, 'args', ())) + args
        kwargs = dict (getattr (ex, '__dict__', {}).items () + kwargs.items ())
        super (WrapException, self).__init__ (*args)
        for k, v in kwargs.items (): setattr (self, k, v)
        self._type = type (ex)

    @property
    def inner (self):

        assert hasattr (self, '_type')
        assert issubclass (self._type, Exception)

        ex = self._type (*self.args, **{
            key: self.__dict__[key] for key in self.__dict__
                if not key.startswith ('_') ## no private attributes
        })

        for key, value in self.__dict__.items ():
            if key.startswith ('_'): setattr (ex, key, value)

        return ex

###############################################################################
###############################################################################

class PickleZlib (object):

    @staticmethod
    def send_pyobj (socket, obj, flags=0, protocol=-1):

        obj = WrapException (obj) if isinstance (obj, Exception) else obj
        p = pickle.dumps (obj, protocol)
        z = zlib.compress (p)

        return socket.send (z, flags=flags)

    @staticmethod
    def recv_pyobj (socket, flags=0):

        z = socket.recv (flags)
        p = zlib.decompress (z)
        obj = pickle.loads (p)

        return obj.inner if isinstance (obj, WrapException) else obj

###############################################################################
###############################################################################
