__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..session.anchor import SessionAnchor
from .base import BaseTestCase

import uuid
import hashlib
import contextlib

###############################################################################
###############################################################################

class SessionAnchorTestCase (BaseTestCase):

    @contextlib.contextmanager
    def init_anchor (self):
        with self.app.session_transaction () as session:
            session['_id'] = hashlib.md5 (str (uuid.uuid4 ())).digest ()
            yield SessionAnchor (session)

    def test_get_version_key (self):
        with self.init_anchor () as anchor:
            version_key = anchor.get_version_key ()
            self.assertIsNotNone (version_key)

    def test_get_version (self):
        with self.init_anchor () as anchor:
            version_key = anchor.get_version_key ()
            self.assertIsNotNone (version_key)

            version, key = anchor.get_version ()
            self.assertEqual (key, version_key)
            self.assertGreaterEqual (version, 0)

    def test_get_value_key (self):
        with self.init_anchor () as anchor:
            value_key, version = anchor.get_value_key ()
            self.assertIsNotNone (value_key)
            self.assertGreaterEqual (version, 0)

    def test_get_value (self):
        with self.init_anchor () as anchor:
            value_key, version = anchor.get_value_key ()
            self.assertIsNotNone (value_key)
            self.assertGreaterEqual (version, 0)

            anchor.clear ()
            value, key = anchor.get_value ()
            self.assertEqual (key, value_key)
            self.assertIsNone (value)

    def test_set_value (self):
        with self.init_anchor () as anchor:
            value_key, version = anchor.get_value_key ()
            self.assertIsNotNone (value_key)
            self.assertGreaterEqual (version, 0)

            anchor.set_value ('value')
            value, key = anchor.get_value ()
            self.assertEqual (key, value_key)
            self.assertEqual (value, 'value')

            anchor.clear ()

###############################################################################
###############################################################################
