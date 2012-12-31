__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..ext import db
from ..app import app
from ..config import TestConfig

import unittest

###############################################################################
###############################################################################

class BaseTestCase (unittest.TestCase):

    def setUp (self):

        app.config.from_object (TestConfig)

        self.app = app.test_client ()
        self.db = db
        self.db.create_all ()

    def tearDown (self):

        self.db.session.remove ()
        self.db.drop_all ()

###############################################################################
###############################################################################
