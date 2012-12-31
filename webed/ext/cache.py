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

    @staticmethod
    def make_key (*args, **kwargs):

        kwargs.update (dict (enumerate (args)))
        string = JSON.encode (sorted (kwargs.items ()))
        hashed = hashlib.sha512 (string)

        return hashed.hexdigest ()

    def cached (self, timeout=None, name=None, session=None, unless=None,
                keyfunc=None):

        if keyfunc is None:
            keyfunc = lambda ss, fn, *args, **kwargs: \
                WebedCache.make_key (ss, name or fn.__name__) ## no (kw)args!

        return self.memoize (timeout, name, session, unless, keyfunc)

    def memoize (self, timeout=None, name=None, session=None, unless=None,
                 keyfunc=None):

        if keyfunc is None:
            keyfunc = WebedCache.make_key

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)

                key = keyfunc (session, name or fn.__name__, *args, **kwargs)
                cached_value = self.get (key)

                if cached_value is None:
                    cached_value = fn (*args, **kwargs)
                    self.set (key, cached_value, timeout=timeout)

                return cached_value
            return decorated
        return decorator

cache = WebedCache (app)

###############################################################################
###############################################################################
