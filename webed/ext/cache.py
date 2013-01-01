__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.cache import Cache
from ..app import app

import hashlib
import functools

###############################################################################
###############################################################################

class WebedCache (Cache):

    @staticmethod
    def make_key (*args, **kwargs):

        kwargs.update (dict (enumerate (args)))
        string = unicode (sorted (kwargs.items ()))
        hashed = hashlib.sha512 (string)

        return hashed.hexdigest ()

    def cached (self, timeout=None, name=None, session=None, unless=None,
                keyfunc=None):

        if not callable (keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs: \
                WebedCache.make_key (sid, name or fn.__name__) ## no (kw)args!

        return self.memoize (timeout, name, session, unless, keyfunc)

    def memoize (self, timeout=None, name=None, session=None, unless=None,
                 keyfunc=None):

        if session:
            sid = session['_id']
        else:
            sid = None

        if not callable (keyfunc):
            keyfunc = WebedCache.make_key

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)

                value_key = keyfunc (sid, name or fn.__name__, *args, **kwargs)
                cached_value = self.get (value_key)

                if cached_value is None:
                    cached_value = fn (*args, **kwargs)
                    self.set (value_key, cached_value, timeout=timeout)
                return cached_value

            decorated.uncached = fn
            decorated.timeout = timeout
            return decorated

        return decorator

    def version (self, timeout=None, *args, **kwargs):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*fn_args, **fn_kwargs):

                version_key = WebedCache.version_key (*args, **kwargs)
                version = cache.get (version_key) or 0
                value_key = cache.make_key (version, *args, **kwargs)
                cached_value = cache.get (value_key)

                if not cached_value:
                    cached_value = fn (*fn_args, **fn_kwargs)
                    cache.set (version_key, version, timeout)
                    cache.set (value_key, cached_value, timeout)
                return cached_value

            decorated.uncached = fn
            decorated.timeout = timeout
            return decorated

        return decorator

    def increase_version (self, *args, **kwargs):
        version_key = WebedCache.version_key (*args, **kwargs)
        version = cache.get (version_key) or 0
        cache.set (version_key, version + 1)

    def decrease_version (self, *args, **kwargs):
        version_key = WebedCache.version_key (*args, **kwargs)
        version = cache.get (version_key) or 0
        cache.set (version_key, version - 1)

    @staticmethod
    def version_key (*args, **kwargs):
        return WebedCache.make_key ('version', *args, **kwargs)

cache = WebedCache (app)

###############################################################################
###############################################################################
