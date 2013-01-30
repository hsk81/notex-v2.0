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

        self.SERVERS = app.config['CACHE_SERVERS']
        assert isinstance (self.SERVERS, list)
        self.KEY_PREFIX = app.config['CACHE_KEY_PREFIX']
        assert isinstance (self.KEY_PREFIX, str)
        self.DEFAULT_TIMEOUT = app.config['CACHE_DEFAULT_TIMEOUT']
        assert isinstance (self.DEFAULT_TIMEOUT, int)
        self.CONNECTION_POOL_SIZE = app.config['CACHE_CONNECTION_POOL_SIZE']
        assert isinstance (self.CONNECTION_POOL_SIZE, int)

        app.mc = pylibmc.Client(self.SERVERS, binary=True,  behaviors={
            'tcp_nodelay': True, 'ketama': True})
        app.mc_pool = pylibmc.ClientPool (app.mc, self.CONNECTION_POOL_SIZE)

    def get (self, key):
        with current_app.mc_pool.reserve () as mc:
            return mc.get (self.KEY_PREFIX+key)

    def set (self, key, value, expiry=None):
        with current_app.mc_pool.reserve () as mc:
            return mc.set (self.KEY_PREFIX+key, value, time=expiry \
                if expiry is not None else self.DEFAULT_TIMEOUT)

    def touch (self, key, expiry=None):
        with current_app.mc_pool.reserve () as mc:
            return mc.touch (self.KEY_PREFIX+key, time=expiry \
                if expiry is not None else self.DEFAULT_TIMEOUT)

    def delete (self, key):
        with current_app.mc_pool.reserve () as mc:
            return mc.delete (self.KEY_PREFIX+key)

    @staticmethod
    def make_key (*args, **kwargs):

        kwargs.update (dict (enumerate (args)))
        string = unicode (sorted (kwargs.items ()))
        hashed = hashlib.md5 (string)

        return hashed.hexdigest ()

    def cached (self, expiry=None, name=None, session=None, keyfunc=None,
                unless=None, lest=None):

        if not callable (keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs: \
                self.make_key (sid, name or fn.__name__) ## no (kw)args!

        return self.memoize (expiry, name, session, keyfunc, unless, lest)

    def memoize (self, expiry=None, name=None, session=None, keyfunc=None,
                 unless=None, lest=None):

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
                if callable (lest) and lest (*args, **kwargs) is True:
                    return fn (*args, **kwargs)

                value_key = keyfunc (sid, name or fn.__name__, *args, **kwargs)
                cached_value = self.get (value_key)

                if cached_value is None:
                    cached_value = fn (*args, **kwargs)
                    self.set (value_key, cached_value, expiry=expiry)
                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry
            return decorated

        return decorator

    def version (self, expiry=None, *args, **kwargs):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*fn_args, **fn_kwargs):

                version_key = self.version_key (*args, **kwargs)
                version = self.get (version_key) or 0
                value_key = self.make_key (version, *args, **kwargs)
                cached_value = self.get (value_key)

                if not cached_value:
                    cached_value = fn (*fn_args, **fn_kwargs)
                    self.set (version_key, version, expiry=expiry)
                    self.set (value_key, cached_value, expiry=expiry)
                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry
            return decorated

        return decorator

    def increase_version (self, expiry=None, *args, **kwargs):
        version_key = self.KEY_PREFIX+self.version_key (*args, **kwargs)
        with current_app.mc_pool.reserve () as mc:
            if version_key in mc:
                mc.incr (version_key)
            else:
                mc.set (version_key, 0, time=expiry \
                    if expiry is not None else self.DEFAULT_TIMEOUT)

    def decrease_version (self, expiry=None, *args, **kwargs):
        version_key = self.KEY_PREFIX+self.version_key (*args, **kwargs)
        with current_app.mc_pool.reserve () as mc:
            if version_key in mc:
                mc.decr (version_key)
            else:
                mc.set (version_key, 0, time=expiry \
                    if expiry is not None else self.DEFAULT_TIMEOUT)

    @staticmethod
    def version_key (*args, **kwargs):
        return WebedCache.make_key ('version', *args, **kwargs)

###############################################################################
###############################################################################

cache = WebedCache (app)

###############################################################################
###############################################################################
