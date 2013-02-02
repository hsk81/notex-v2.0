__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase

from ..app import app
from ..ext.cache import WebedMemcached
from ..ext.cache import WebedRedis

###############################################################################
###############################################################################

class CacheTestCase (BaseTestCase):

    def setUp (self):
        super (CacheTestCase, self).setUp ()
        self.cache = None

    def test_set_and_get (self):

        self.cache.set ('key', 'value')
        value = self.cache.get ('key')
        self.assertEqual (value, 'value')
        self.cache.delete ('key')

    def test_delete (self):

        self.cache.set ('key', 'value')
        self.cache.delete ('key')
        value = self.cache.get ('key')
        self.assertIsNone (value)

    def test_expire (self):

        self.cache.set ('key', 'value', expiry=self.cache.IMMEDIATE)
        value = self.cache.get ('key')
        self.assertIsNone (value)

        self.cache.set ('key', 'value')
        value = self.cache.get ('key')
        self.assertEqual (value, 'value')

        self.cache.expire ('key', expiry=self.cache.IMMEDIATE)
        value = self.cache.get ('key')
        self.assertIsNone (value)

    def test_exists (self):

        self.cache.set ('key', 'value')
        exists = self.cache.exists ('key')
        self.assertTrue (exists)
        self.cache.delete ('key')

    def test_increase_version (self):

        version_key = self.cache.version_key ('version-key')
        self.cache.delete (version_key)

        self.cache.increase_version ('version-key')
        version = int (self.cache.get (version_key))
        self.assertEqual (version, 0)

        self.cache.increase_version ('version-key')
        version = int (self.cache.get (version_key))
        self.assertEqual (version, 1)

        self.cache.increase_version ('version-key')
        version = int (self.cache.get (version_key))
        self.assertEqual (version, 2)

        self.cache.delete (version_key)

    def test_decrease_version (self):

        version_key = self.cache.version_key ('version-key')
        self.cache.delete (version_key)

        self.cache.decrease_version ('version-key')
        version = int (self.cache.get (version_key))
        self.assertEqual (version, 0)

        self.cache.increase_version ('version-key')
        version = int (self.cache.get (version_key))
        self.assertEqual (version, 1)

        self.cache.decrease_version ('version-key')
        version = int (self.cache.get (version_key))
        self.assertEqual (version, 0)

        self.cache.delete (version_key)

###############################################################################
###############################################################################

class MemcachedTestCase (CacheTestCase):

    def setUp (self):
        super (MemcachedTestCase, self).setUp ()
        self.cache = WebedMemcached (app, servers=app.config['CACHE0_SERVERS'],
            prefix=app.config['CACHE0_KEY_PREFIX'])

###############################################################################
###############################################################################

class RedisTestCase (CacheTestCase):

    def setUp (self):
        super (RedisTestCase, self).setUp ()
        self.cache = WebedRedis (app, servers=app.config['CACHE0_SERVERS'],
            prefix=app.config['CACHE0_KEY_PREFIX'], db=0)

###############################################################################
###############################################################################
