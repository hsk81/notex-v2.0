__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.cache import Cache
from ..app import app
from ..util import JSON

import hashlib
import functools

###############################################################################
###############################################################################

class WebedCache (Cache):

    def make_key (self, *args, **kwargs):

        kwargs.update (dict (enumerate (args)))
        string = JSON.encode (sorted (kwargs.items ()))
        hashed = hashlib.sha512 (string)

        return hashed.hexdigest ()

    def cached (self, timeout=None, name=None, session=None, unless=None):

        def get_name (fn):
            return fn.__name__ ## TODO: Fully qualified name!?

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)

                key = self.make_key (session, name or get_name (fn))
                value = self.get (key)

                if value is None:
                    value = fn (*args, **kwargs)
                    self.set (key, value, timeout=timeout)

                return value
            return decorated
        return decorator

    def memoize (self, timeout=None, name=None, session=None, unless=None):

        def get_name (fn):
            return fn.__name__ ## TODO: Fully qualified name!?

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)

                key = self.make_key (
                    session, name or get_name (fn), *args, **kwargs)
                value = self.get (key)

                if value is None:
                    value = fn (*args, **kwargs)
                    self.set (key, value, timeout=timeout)

                return value
            return decorated
        return decorator

cache = WebedCache (app)

###############################################################################
###############################################################################
