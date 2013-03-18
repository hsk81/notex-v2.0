__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import _app_ctx_stack as stack
from ..app import app

import abc
import redis
import cPickle
import pylibmc
import hashlib
import functools

###############################################################################
###############################################################################

DEFAULT_TIMEOUT = app.config.get ('CACHE_DEFAULT_TIMEOUT')

###############################################################################
###############################################################################

class WebedCache (object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def NEVER (self): return
    @abc.abstractproperty
    def ASAP (self): return

    @abc.abstractmethod
    def get (self, key, expiry=None): return
    @abc.abstractmethod
    def get_number (self, key, expiry=None): return
    @abc.abstractmethod
    def get_value (self, key, expiry=None): return
    @abc.abstractmethod
    def set (self, key, value, expiry=DEFAULT_TIMEOUT): pass
    @abc.abstractmethod
    def set_number (self, key, value, expiry=DEFAULT_TIMEOUT): pass
    @abc.abstractmethod
    def set_value (self, key, value, expiry=DEFAULT_TIMEOUT): pass
    @abc.abstractmethod
    def delete (self, key): pass
    @abc.abstractmethod
    def expire (self, key, expiry=DEFAULT_TIMEOUT): pass
    @abc.abstractmethod
    def exists (self, key): return
    @abc.abstractmethod
    def increase (self, key, expiry=DEFAULT_TIMEOUT): pass
    @abc.abstractmethod
    def decrease (self, key, expiry=DEFAULT_TIMEOUT): pass
    @abc.abstractmethod
    def flush_all (self): pass

    ###########################################################################

    def cached (self, expiry=DEFAULT_TIMEOUT, name=None, session=None,
                keyfunc=None, unless=None, lest=None):

        if not callable (keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs: \
                self.make_key (sid, name or fn.__name__) ## no (kw)args!

        return self.memoize (expiry, name, session, keyfunc, unless, lest)

    def memoize (self, expiry=DEFAULT_TIMEOUT, name=None, session=None,
                 keyfunc=None, unless=None, lest=None):

        if not callable (keyfunc):
            keyfunc = self.make_key

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)
                if callable (lest) and lest (*args, **kwargs) is True:
                    return fn (*args, **kwargs)

                if session:
                    s2t = session.get ('_id'), session.get ('_token')
                else:
                    s2t = None

                value_key = keyfunc (s2t, name or fn.__name__, *args, **kwargs)
                cached_value = self.get (value_key)

                if cached_value is None:
                    cached_value = fn (*args, **kwargs)
                    self.set (value_key, cached_value, expiry=expiry)

                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry

            return decorated
        return decorator

    def version (self, expiry=DEFAULT_TIMEOUT, *args, **kwargs):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*fn_args, **fn_kwargs):

                version_key = self.version_key (*args, **kwargs)
                version = self.get_number (version_key) or 0
                value_key = self.make_key (version, *args, **kwargs)
                cached_value = self.get (value_key)

                if not cached_value:
                    cached_value = fn (*fn_args, **fn_kwargs)
                    self.set_number (version_key, version, expiry=self.NEVER)
                    self.set (value_key, cached_value, expiry=expiry)

                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry

            return decorated
        return decorator

    @staticmethod
    def version_key (*args, **kwargs):
        return WebedCache.make_key ('version', *args, **kwargs)

    @staticmethod
    def make_key (*args, **kwargs):

        kwargs.update (dict (enumerate (args)))
        string = unicode (sorted (kwargs.items ()))
        hashed = hashlib.md5 (string)

        return hashed.hexdigest ()

    def increase_version (self, *args, **kwargs):
        self.increase (self.version_key (*args, **kwargs))

    def decrease_version (self, *args, **kwargs):
        self.decrease (self.version_key (*args, **kwargs))

###############################################################################
###############################################################################

DEFAULT_TIMEOUT = app.config.get ('CACHE_DEFAULT_TIMEOUT', 0)

###############################################################################
###############################################################################

class WebedMemcached (WebedCache):

    @property
    def NEVER (self):
        return 0
    @property
    def ASAP (self):
        return None

    def __init__ (self, app, servers=None, prefix=None, pool_size=None):

        if app is not None:
            self.app = app
            self.init_app (self.app, servers, prefix, pool_size)
        else:
            self.app = None

    def init_app (self, app, servers=None, prefix=None, pool_size=None):

        app.config.setdefault ('CACHE_DEFAULT_SERVERS', ['127.0.0.1'])
        app.config.setdefault ('CACHE_DEFAULT_KEY_PREFIX', 'cache:')
        app.config.setdefault ('CACHE_DEFAULT_POOL_SIZE', 2**8)

        self.SERVERS = servers \
            if servers else app.config['CACHE_DEFAULT_SERVERS']
        assert isinstance (self.SERVERS, list)
        self.KEY_PREFIX = prefix \
            if prefix else app.config['CACHE_DEFAULT_KEY_PREFIX']
        assert isinstance (self.KEY_PREFIX, str)
        self.POOL_SIZE = pool_size \
            if pool_size else app.config['CACHE_DEFAULT_POOL_SIZE']
        assert isinstance (self.POOL_SIZE, int)

    def get (self, key, expiry=None):
        return self.get_value (key, expiry=expiry)

    def get_number (self, key, expiry=None):
        return self.get_value (key, expiry=expiry)

    def get_value (self, key, expiry=None):
        with self.connection.reserve () as mc:
            value = mc.get (self.KEY_PREFIX+key)
            if expiry: self.expire (key, expiry=expiry)
            return value

    def set (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, value, expiry=expiry)

    def set_number (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, value, expiry=expiry)

    def set_value (self, key, value, expiry=DEFAULT_TIMEOUT):
        with self.connection.reserve () as mc:
            if expiry == self.ASAP:
                mc.delete (self.KEY_PREFIX+key)
            else:
                mc.set (self.KEY_PREFIX+key, value, time=expiry)

    def delete (self, key):
        with self.connection.reserve () as mc:
            mc.delete (self.KEY_PREFIX+key)

    def expire (self, key, expiry=DEFAULT_TIMEOUT):
        with self.connection.reserve () as mc:
            if expiry == self.ASAP:
                mc.delete (self.KEY_PREFIX+key)
            else:
                mc.touch (self.KEY_PREFIX+key, time=expiry)

    def exists (self, key):
        with self.connection.reserve () as mc:
            return self.KEY_PREFIX+key in mc

    def increase (self, key, expiry=DEFAULT_TIMEOUT):
        key = self.KEY_PREFIX+key
        with self.connection.reserve () as mc:
            value = mc.get (key)+1 if key in mc else +1
            if expiry == self.ASAP: mc.delete (key)
            else: mc.set (key, value, time=expiry)
            return value

    def decrease (self, key, expiry=DEFAULT_TIMEOUT):
        key = self.KEY_PREFIX+key
        with self.connection.reserve () as mc:
            value = mc.get (key)-1 if key in mc else -1
            if expiry == self.ASAP: mc.delete (key)
            else: mc.set (key, value, time=expiry)
            return value

    def flush_all (self):
        with self.connection.reserve () as mc:
            mc.flush_all ()

    ###########################################################################

    @property
    def connection (self):
        ctx = stack.top
        if ctx is not None:
            if not hasattr (ctx, 'memcached'):
                ctx.memcached = self.connect ()
            return ctx.memcached

    def connect (self):
        mc = pylibmc.Client (self.SERVERS, binary=True, behaviors={
            'tcp_nodelay': True, 'no_block': True, 'ketama': True
        })

        return pylibmc.ClientPool (mc, self.POOL_SIZE)

###############################################################################
###############################################################################

DEFAULT_TIMEOUT = app.config.get ('CACHE_DEFAULT_TIMEOUT', None)

###############################################################################
###############################################################################

class WebedRedis (WebedCache):

    @property
    def NEVER (self):
        return None
    @property
    def ASAP (self):
        return 0

    def __init__ (self, app, servers=None, prefix=None, port=None, db=None):

        if app is not None:
            self.app = app
            self.init_app (self.app, servers, prefix, port, db)
        else:
            self.app = None

    def init_app (self, app, servers=None, prefix=None, port=None, db=None):

        app.config.setdefault ('CACHE_DEFAULT_SERVERS', ['127.0.0.1'])
        app.config.setdefault ('CACHE_DEFAULT_KEY_PREFIX', 'cache:')
        app.config.setdefault ('CACHE_DEFAULT_PORT', 6379)
        app.config.setdefault ('CACHE_DEFAULT_DB', 0)

        self.SERVERS = servers \
            if servers else app.config['CACHE_DEFAULT_SERVERS']
        assert isinstance (self.SERVERS, list)
        self.KEY_PREFIX = prefix \
            if prefix else app.config['CACHE_DEFAULT_KEY_PREFIX']
        assert isinstance (self.KEY_PREFIX, str)
        self.PORT = port \
            if port else app.config['CACHE_DEFAULT_PORT']
        assert isinstance (self.PORT, int)
        self.DB = db \
            if db else app.config['CACHE_DEFAULT_DB']
        assert isinstance (self.DB, int)

    def get (self, key, expiry=None):
        value = self.get_value (key, expiry=expiry)
        if value: return cPickle.loads (value)

    def get_number (self, key, expiry=None):
        value = self.get_value (key, expiry=expiry)
        if value: return int (value)

    def get_value (self, key, expiry=None):
        if not expiry:
            return self.connection.get (self.KEY_PREFIX+key)
        else:
            return self.connection.pipeline ().get (self.KEY_PREFIX+key) \
                .expire (self.KEY_PREFIX+key, time=expiry) \
                .execute ().pop (0)

    def set (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, cPickle.dumps (value), expiry=expiry)

    def set_number (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, int (value), expiry=expiry)

    def set_value (self, key, value, expiry=DEFAULT_TIMEOUT):
        if expiry == self.NEVER:
            self.connection.pipeline ().set (self.KEY_PREFIX+key, value) \
                .persist (self.KEY_PREFIX+key).execute ()
        else:
            self.connection.pipeline ().set (self.KEY_PREFIX+key, value) \
                .expire (self.KEY_PREFIX+key, time=expiry).execute ()

    def delete (self, key):
        self.connection.delete (self.KEY_PREFIX+key)

    def expire (self, key, expiry=DEFAULT_TIMEOUT):
        if expiry == self.NEVER:
            self.connection.persist (self.KEY_PREFIX+key)
        else:
            self.connection.expire (self.KEY_PREFIX+key, time=expiry)

    def exists (self, key):
        return self.connection.exists (self.KEY_PREFIX+key)

    def increase (self, key, expiry=DEFAULT_TIMEOUT):
        if expiry == self.NEVER:
            return self.connection.pipeline ().incr (self.KEY_PREFIX+key) \
                .persist (self.KEY_PREFIX+key) \
                .execute ().pop (0)
        else:
            return self.connection.pipeline ().incr (self.KEY_PREFIX+key) \
                .expire (self.KEY_PREFIX+key, time=expiry) \
                .execute ().pop (0)

    def decrease (self, key, expiry=DEFAULT_TIMEOUT):
        if expiry == self.NEVER:
            return self.connection.pipeline ().decr (self.KEY_PREFIX+key) \
                .persist (self.KEY_PREFIX+key) \
                .execute ().pop (0)
        else:
            return self.connection.pipeline ().decr (self.KEY_PREFIX+key) \
                .expire (self.KEY_PREFIX+key, time=expiry) \
                .execute ().pop (0)

    def flush_all (self):
        self.connection.flushall ()

    ###########################################################################

    @property
    def connection (self):
        ctx = stack.top
        if ctx is not None:
            if not hasattr (ctx, 'redis'):
                ctx.redis = self.connect ()
            return ctx.redis

    def connect (self):
        return redis.StrictRedis (host=self.SERVERS[0], port=self.PORT,
            db=self.DB)

###############################################################################
###############################################################################

std_cache = WebedRedis (app, servers=app.config.get ('CACHE0_SERVERS'),
    prefix=app.config.get ('CACHE0_KEY_PREFIX'), db=0)

sss_cache = WebedRedis (app, servers=app.config.get ('CACHE1_SERVERS'),
    prefix=app.config.get ('CACHE1_KEY_PREFIX'), db=1)

ver_cache = WebedRedis (app, servers=app.config.get ('CACHE2_SERVERS'),
    prefix=app.config.get ('CACHE2_KEY_PREFIX'), db=2)

tpl_cache = WebedRedis (app, servers=app.config.get ('CACHE3_SERVERS'),
    prefix=app.config.get ('CACHE3_KEY_PREFIX'), db=3)

obj_cache = WebedRedis (app, servers=app.config.get ('CACHE4_SERVERS'),
    prefix=app.config.get ('CACHE4_KEY_PREFIX'), db=4)

###############################################################################
###############################################################################
