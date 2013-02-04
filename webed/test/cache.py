__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase

from ..app import app
from ..ext.cache import WebedMemcached
from ..ext.cache import WebedRedis

from uuid import uuid4 as uuid_random
from random import random

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

        self.cache.set ('key', 'value', expiry=self.cache.ASAP)
        value = self.cache.get ('key')
        self.assertIsNone (value)

        self.cache.set ('key', 'value')
        value = self.cache.get ('key')
        self.assertEqual (value, 'value')

        self.cache.expire ('key', expiry=self.cache.ASAP)
        value = self.cache.get ('key')
        self.assertIsNone (value)

    def test_exists (self):

        self.cache.set ('key', 'value')
        exists = self.cache.exists ('key')
        self.assertTrue (exists)
        self.cache.delete ('key')

    def test_increase (self):

        number = self.cache.increase ('key')
        self.assertEqual (number, +1)
        number = self.cache.get_number ('key')
        self.assertEqual (number, +1)
        number = self.cache.increase ('key')
        self.assertEqual (number, +2)
        number = self.cache.get_number ('key')
        self.assertEqual (number, +2)
        number = self.cache.increase ('key')
        self.assertEqual (number, +3)
        number = self.cache.get_number ('key')
        self.assertEqual (number, +3)
        self.cache.delete ('key')

    def test_decrease (self):

        number = self.cache.decrease ('key')
        self.assertEqual (number, -1)
        number = self.cache.get_number ('key')
        self.assertEqual (number, -1)
        number = self.cache.decrease ('key')
        self.assertEqual (number, -2)
        number = self.cache.get_number ('key')
        self.assertEqual (number, -2)
        number = self.cache.decrease ('key')
        self.assertEqual (number, -3)
        number = self.cache.get_number ('key')
        self.assertEqual (number, -3)
        self.cache.delete ('key')

    def test_increase_version (self):

        version_key = self.cache.version_key ('version-key')
        self.cache.delete (version_key)

        self.cache.increase_version ('version-key')
        version = self.cache.get_number (version_key)
        self.assertEqual (version, 1)

        self.cache.increase_version ('version-key')
        version = self.cache.get_number (version_key)
        self.assertEqual (version, 2)

        self.cache.increase_version ('version-key')
        version = self.cache.get_number (version_key)
        self.assertEqual (version, 3)

        self.cache.delete (version_key)

    def test_decrease_version (self):

        version_key = self.cache.version_key ('version-key')
        self.cache.delete (version_key)

        self.cache.decrease_version ('version-key')
        version = self.cache.get_number (version_key)
        self.assertEqual (version, -1)

        self.cache.decrease_version ('version-key')
        version = self.cache.get_number (version_key)
        self.assertEqual (version, -2)

        self.cache.decrease_version ('version-key')
        version = self.cache.get_number (version_key)
        self.assertEqual (version, -3)

        self.cache.delete (version_key)

    def test_version (self, uuid=uuid_random ()):

        @self.cache.version (key=[uuid, 'key-part-1', 'key-part-2'])
        def cached_value (self): return random ()

        value_0 = cached_value (self)

        self.cache.increase_version (key=[uuid, 'key-part-1', 'key-part-2'])
        value_1 = cached_value (self)
        self.assertNotEqual (value_0, value_1)

        self.cache.decrease_version (key=[uuid, 'key-part-1', 'key-part-2'])
        value_2 = cached_value (self)
        self.assertNotEqual (value_1, value_2)
        self.assertEqual (value_0, value_2)

        self.cache.decrease_version (key=[uuid, 'key-part-1', 'key-part-2'])
        value_3 = cached_value (self)
        self.assertNotEqual (value_2, value_3)
        self.assertNotEqual (value_1, value_3)
        self.assertNotEqual (value_0, value_3)

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
