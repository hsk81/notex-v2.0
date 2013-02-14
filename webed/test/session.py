__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase
from ..session.anchor import SessionAnchor

###############################################################################
###############################################################################

class SessionAnchorTestCase (BaseTestCase):
    session_id = '\x83\xda\x97\xdb]2\x8a\x98\xc8\x93K\xf1\xd4\xf6\x04\xfe'

    def init_anchor (self):

        with self.app.session_transaction () as session:
            session['_id'] = self.session_id
            anchor = SessionAnchor (session)
            self.assertEqual (anchor._sid, session['_id'])
            return anchor

    def test_get_version_key (self):
        anchor = self.init_anchor ()

        version_key = anchor.get_version_key ()
        self.assertIsNotNone (version_key)

    def test_get_version (self):
        anchor = self.init_anchor ()

        version_key = anchor.get_version_key ()
        self.assertIsNotNone (version_key)

        version, key = anchor.get_version ()
        self.assertEqual (key, version_key)
        self.assertGreaterEqual (version, 0)

    def test_get_value_key (self):
        anchor = self.init_anchor ()

        value_key, version = anchor.get_value_key ()
        self.assertIsNotNone (value_key)
        self.assertGreaterEqual (version, 0)

    def test_get_value (self):
        anchor = self.init_anchor ()

        value_key, version = anchor.get_value_key ()
        self.assertIsNotNone (value_key)
        self.assertGreaterEqual (version, 0)

        anchor.clear ()

        value, key = anchor.get_value ()
        self.assertEqual (key, value_key)
        self.assertIsNone (value)

    def test_set_value (self):
        anchor = self.init_anchor ()

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
