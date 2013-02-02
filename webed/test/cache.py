__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase
from ..ext import cache

###############################################################################
###############################################################################

class CacheTestCase (BaseTestCase):

    def test_set_and_get (self):

        cache.set ('key', 'value')
        value = cache.get ('key')
        self.assertEqual (value, 'value')
        cache.delete ('key')

    def test_delete (self):

        cache.set ('key', 'value')
        cache.delete ('key')
        value = cache.get ('key')
        self.assertIsNone (value)

    def test_expire (self):

        cache.set ('key', 'value', expiry=cache.IMMEDIATE)
        value = cache.get ('key')
        self.assertIsNone (value)

        cache.set ('key', 'value')
        value = cache.get ('key')
        self.assertEqual (value, 'value')

        cache.expire ('key', expiry=cache.IMMEDIATE)
        value = cache.get ('key')
        self.assertIsNone (value)

    def test_exists (self):

        cache.set ('key', 'value')
        exists = cache.exists ('key')
        self.assertTrue (exists)
        cache.delete ('key')

    def test_increase_version (self):

        version_key = cache.version_key ('version-key')
        cache.delete (version_key)

        cache.increase_version ('version-key')
        version = int (cache.get (version_key))
        self.assertEqual (version, 0)

        cache.increase_version ('version-key')
        version = int (cache.get (version_key))
        self.assertEqual (version, 1)

        cache.increase_version ('version-key')
        version = int (cache.get (version_key))
        self.assertEqual (version, 2)

        cache.delete (version_key)

    def test_decrease_version (self):

        version_key = cache.version_key ('version-key')
        cache.delete (version_key)

        cache.decrease_version ('version-key')
        version = int (cache.get (version_key))
        self.assertEqual (version, 0)

        cache.increase_version ('version-key')
        version = int (cache.get (version_key))
        self.assertEqual (version, 1)

        cache.decrease_version ('version-key')
        version = int (cache.get (version_key))
        self.assertEqual (version, 0)

        cache.delete (version_key)

###############################################################################
###############################################################################
