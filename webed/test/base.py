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
        self.db.session.script (['webed', 'models', 'sql', 'npv_create.sql'])
        self.db.session.script (['webed', 'models', 'sql', 'npt_insert.sql'])
        self.db.session.script (['webed', 'models', 'sql', 'npt_delete.sql'])
        self.db.session.commit ()

    def tearDown (self):

        self.db.session.script (['webed', 'models', 'sql', 'npv_drop.sql'])
        self.db.session.script (['webed', 'models', 'sql', 'npt_drop.sql'])
        self.db.session.commit ()
        self.db.drop_all ()

        self.db.session_manager.remove ()

###############################################################################
###############################################################################
