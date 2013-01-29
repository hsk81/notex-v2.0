__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import current_app
from ..app import app

import pylibmc
import hashlib
import functools

###############################################################################
###############################################################################

class WebedCache:

    def __init__ (self, app):

        CACHE_KEY_PREFIX = app.config['CACHE_KEY_PREFIX']
        assert CACHE_KEY_PREFIX
        CACHE_DEFAULT_TIMEOUT = app.config['CACHE_DEFAULT_TIMEOUT']
        assert CACHE_DEFAULT_TIMEOUT
        CACHE_MEMCACHED_SERVERS = app.config['CACHE_MEMCACHED_SERVERS']
        assert CACHE_MEMCACHED_SERVERS

        app.mc = pylibmc.Client (CACHE_MEMCACHED_SERVERS)
        app.mc_pool = pylibmc.ThreadMappedPool (app.mc)

    def get (self, *args, **kwargs):
        with current_app.mc_pool.reserve () as mc:
            return mc.get (*args, **kwargs)

    def set (self, *args, **kwargs):

        if 'timeout' in kwargs:
            timeout = kwargs.pop ('timeout')
            kwargs['time'] = int (timeout) if timeout else 0
        else:
            kwargs['time'] = app.config['CACHE_DEFAULT_TIMEOUT']

        with current_app.mc_pool.reserve () as mc:
            return mc.set (*args, **kwargs)

    def delete (self, *args, **kwargs):
        with current_app.mc_pool.reserve () as mc:
            return mc.delete (*args, **kwargs)

    @staticmethod
    def make_key (*args, **kwargs):

        kwargs.update (dict (enumerate (args)))
        string = unicode (sorted (kwargs.items ()))
        hashed = hashlib.md5 (string)

        return hashed.hexdigest ()

    def cached (self, timeout=None, name=None, session=None, unless=None,
                keyfunc=None):

        if not callable (keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs: \
                self.make_key (sid, name or fn.__name__) ## no (kw)args!

        return self.memoize (timeout, name, session, unless, keyfunc)

    def memoize (self, timeout=None, name=None, session=None, unless=None,
                 keyfunc=None):

        if session:
            sid = session['_id']
        else:
            sid = None

        if not callable (keyfunc):
            keyfunc = self.make_key

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

                version_key = self.version_key (*args, **kwargs)
                version = self.get (version_key) or 0
                value_key = self.make_key (version, *args, **kwargs)
                cached_value = self.get (value_key)

                if not cached_value:
                    cached_value = fn (*fn_args, **fn_kwargs)
                    self.set (version_key, version, timeout=timeout)
                    self.set (value_key, cached_value, timeout=timeout)
                return cached_value

            decorated.uncached = fn
            decorated.timeout = timeout
            return decorated

        return decorator

    def increase_version (self, timeout=None, *args, **kwargs):
        version_key = self.version_key (*args, **kwargs)
        version = self.get (version_key) or 0
        self.set (version_key, version+1, timeout=timeout)

    def decrease_version (self, timeout=None, *args, **kwargs):
        version_key = self.version_key (*args, **kwargs)
        version = self.get (version_key) or 0
        self.set (version_key, version-1, timeout=timeout)

    @staticmethod
    def version_key (*args, **kwargs):
        return WebedCache.make_key ('version', *args, **kwargs)

###############################################################################
###############################################################################

cache = WebedCache (app)

###############################################################################
###############################################################################
