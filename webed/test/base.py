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

    def __call__ (self, result=None):

        self._setUp()
        super (BaseTestCase, self).__call__(result)
        self._tearDown()

    def _setUp (self):

        self.app = app.test_client ()
        self.ctx = app.test_request_context ()
        self.ctx.push ()

    def setUp (self):

        app.config.from_object (TestConfig)

        db.create_all ()
        db.session.script (['webed', 'models', 'sql', 'npv_create.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_insert.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_delete.sql'])
        db.session.commit ()

    def tearDown (self):

        db.session.script (['webed', 'models', 'sql', 'npv_drop.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_drop.sql'])
        db.session.commit ()
        db.drop_all ()

        db.session_manager.remove ()

    def _tearDown (self):

        self.ctx.pop ()

###############################################################################
###############################################################################
