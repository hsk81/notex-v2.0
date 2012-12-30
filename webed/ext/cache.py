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
        string = JSON.encode (kwargs)
        hashed = hashlib.md5 (string)

        return hashed.hexdigest ()

    def memoize (self, timeout=None, name=None, session=None, unless=None):

        def get_name (fn):
            return fn.__name__ ## TODO: Fully qualified name!?

        def wrap (fn):
            @functools.wraps (fn)
            def wrapped (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)

                args.insert (0, name or get_name (fn))
                if session: args.insert (0, session)

                key = self.make_key (*args, **kwargs)
                value = self.get (key)

                if value is None:
                    value = fn (*args, **kwargs)
                    self.set (key, value, timeout=timeout)

                return value
            return wrapped
        return wrap

cache = WebedCache (app)

###############################################################################
###############################################################################
