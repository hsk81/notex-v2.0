__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..app import app
from ..config import TestConfig
from ..ext import db

import unittest

###############################################################################
###############################################################################

class BaseTestCase (unittest.TestCase):

    def setUp (self):

        app.config.from_object (TestConfig)
        app.config.from_envvar ('WEBED_SETTINGS', silent=True)

        self.app = app.test_client ()
        self.db = db
        self.db.create_all ()

    def tearDown (self):

        self.db.session.remove ()
        self.db.drop_all ()

###############################################################################
###############################################################################
