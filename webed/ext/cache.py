__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..app import app

import abc
import redis
import cPickle
import pylibmc
import hashlib
import functools

###############################################################################
###############################################################################

DEFAULT_TIMEOUT = app.config['CACHE_DEFAULT_TIMEOUT']

###############################################################################
###############################################################################

class WebedCache (object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def NEVER (self): return
    @abc.abstractproperty
    def ASAP (self): return

    @abc.abstractmethod
    def get (self, key): return
    @abc.abstractmethod
    def get_number (self, key): return
    @abc.abstractmethod
    def get_value (self, key): return
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
    def increase (self, key): pass
    @abc.abstractmethod
    def decrease (self, key): pass
    @abc.abstractmethod
    def flush_all (self): pass

    ###########################################################################

    def cached (self, expiry=DEFAULT_TIMEOUT, name=None, session=None,
                keyfunc=None, unless=None, lest=None):

        if not callable (keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs:\
            self.make_key (sid, name or fn.__name__) ## no (kw)args!

        return self.memoize (expiry, name, session, keyfunc, unless, lest)

    def memoize (self, expiry=DEFAULT_TIMEOUT, name=None, session=None,
                 keyfunc=None, unless=None, lest=None):

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

class WebedMemcached (WebedCache):

    @property
    def NEVER (self):
        return 0

    @property
    def ASAP (self):
        return None

    def __init__ (self, app, servers=None, pool_size=None, prefix=None):
        self.app = app

        self.SERVERS = servers if servers else \
            app.config.get ('CACHE_DEFAULT_SERVERS', None)
        assert isinstance (self.SERVERS, list)
        self.KEY_PREFIX = prefix if prefix else \
            app.config.get ('CACHE_DEFAULT_KEY_PREFIX', None)
        assert isinstance (self.KEY_PREFIX, str)
        self.POOL_SIZE = pool_size if pool_size else \
            app.config.get ('CACHE_DEFAULT_POOL_SIZE', 2**8)
        assert isinstance (self.POOL_SIZE, int)

        app.mc = pylibmc.Client (self.SERVERS, binary=True, behaviors={
            'tcp_nodelay': True,
            'no_block': True,
            'ketama': True
        })

        app.mc_pool = pylibmc.ClientPool (app.mc, self.POOL_SIZE)

    def get (self, key):
        return self.get_value (key)

    def get_number (self, key):
        return self.get_value (key)

    def get_value (self, key):
        with self.app.mc_pool.reserve () as mc:
            return mc.get (self.KEY_PREFIX+key)

    def set (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, value, expiry=expiry)

    def set_number (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, value, expiry=expiry)

    def set_value (self, key, value, expiry=DEFAULT_TIMEOUT):
        with self.app.mc_pool.reserve () as mc:
            if expiry == self.ASAP:
                mc.delete (self.KEY_PREFIX+key)
            else:
                mc.set (self.KEY_PREFIX+key, value, time=expiry)

    def delete (self, key):
        with self.app.mc_pool.reserve () as mc:
            mc.delete (self.KEY_PREFIX+key)

    def expire (self, key, expiry=DEFAULT_TIMEOUT):
        with self.app.mc_pool.reserve () as mc:
            if expiry == self.ASAP:
                mc.delete (self.KEY_PREFIX+key)
            else:
                mc.touch (self.KEY_PREFIX+key, time=expiry)

    def exists (self, key):
        with self.app.mc_pool.reserve () as mc:
            return self.KEY_PREFIX+key in mc

    def increase (self, key):
        key = self.KEY_PREFIX+key
        with self.app.mc_pool.reserve () as mc:
            if key not in mc:
                mc.set (key, +1, time=self.NEVER)
            else:
                mc.set (key, mc.get (key)+1, time=self.NEVER)

    def decrease (self, key):
        key = self.KEY_PREFIX+key
        with self.app.mc_pool.reserve () as mc:
            if key not in mc:
                mc.set (key, -1, time=self.NEVER)
            else:
                mc.set (key, mc.get (key)-1, time=self.NEVER)

    def flush_all (self):
        with self.app.mc_pool.reserve () as mc:
            mc.flush_all ()

###############################################################################
###############################################################################

class WebedRedis (WebedCache):

    @property
    def NEVER (self):
        return None

    @property
    def ASAP (self):
        return 0

    def __init__ (self, app, servers=None, port=None, prefix=None, db=0):
        self.app = app

        self.SERVERS = servers if servers else \
            app.config.get ('CACHE_DEFAULT_SERVERS', None)
        assert isinstance (self.SERVERS, list)
        self.KEY_PREFIX = prefix if prefix else \
            app.config.get ('CACHE_DEFAULT_KEY_PREFIX', None)
        assert isinstance (self.KEY_PREFIX, str)
        self.PORT = port if port else \
            app.config.get ('CACHE_DEFAULT_PORT', 6379)
        assert isinstance (self.PORT, int)

        app.rd = redis.StrictRedis (host=self.SERVERS[0], port=self.PORT,
            db=db)

    def get (self, key):
        value = self.get_value (key)
        if value: return cPickle.loads (value)

    def get_number (self, key):
        value = self.get_value (key)
        if value: return int (value)

    def get_value (self, key):
        return self.app.rd.get (self.KEY_PREFIX+key)

    def set (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, cPickle.dumps (value), expiry=expiry)

    def set_number (self, key, value, expiry=DEFAULT_TIMEOUT):
        self.set_value (key, int (value), expiry=expiry)

    def set_value (self, key, value, expiry=DEFAULT_TIMEOUT):
        if expiry == self.NEVER:
            self.app.rd.pipeline ().set (self.KEY_PREFIX+key, value) \
                .persist (self.KEY_PREFIX+key).execute ()
        else:
            self.app.rd.pipeline ().set (self.KEY_PREFIX+key, value) \
                .expire (self.KEY_PREFIX+key, time=expiry).execute ()

    def delete (self, key):
        self.app.rd.delete (self.KEY_PREFIX+key)

    def expire (self, key, expiry=DEFAULT_TIMEOUT):
        if expiry == self.NEVER:
            self.app.rd.persist (self.KEY_PREFIX+key)
        else:
            self.app.rd.expire (self.KEY_PREFIX+key, time=expiry)

    def exists (self, key):
        return self.app.rd.exists (self.KEY_PREFIX+key)

    def increase (self, key):
        self.app.rd.incr (self.KEY_PREFIX+key)

    def decrease (self, key):
        self.app.rd.decr (self.KEY_PREFIX+key)

    def flush_all (self):
        self.app.rd.flushall ()

###############################################################################
###############################################################################

cache = WebedRedis (app, servers=app.config['CACHE0_SERVERS'],
    prefix=app.config['CACHE0_KEY_PREFIX'])

object_cache = WebedRedis (app, servers=app.config['CACHE1_SERVERS'],
    prefix=app.config['CACHE1_KEY_PREFIX'], db=1)

###############################################################################
###############################################################################
