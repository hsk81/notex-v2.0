#!bin/python

###############################################################################
###############################################################################

from json import loads
from webed.linq import Linq

from webed.models import Set, Doc
from webed.extensions import db
from webed.config import TestConfig
from webed import app, views, rest

import unittest

###############################################################################
###############################################################################

class BaseTestCase (unittest.TestCase):

    def setUp (self):

        app.config['TESTING'] = TestConfig.TESTING
        app.config['CSRF_ENABLED'] = TestConfig.CSRF_ENABLED
        app.config['SQLALCHEMY_ECHO'] = TestConfig.SQLALCHEMY_ECHO
        app.config['SQLALCHEMY_DATABASE_URI'] = \
            TestConfig.SQLALCHEMY_DATABASE_URI

        self.app = app.test_client ()
        self.db = db
        self.db.create_all ()

    def tearDown (self):

        self.db.session.remove ()
        self.db.drop_all ()

###############################################################################
###############################################################################

class ModelTestCase (BaseTestCase):

    def create_models (self):

        set = Set ('root', root=None)
        sub = Set ('folder', root=set)
        doc = Doc ('file', 'txt', root=sub)

        return set, sub, doc

    def commit_models (self, (set, sub, doc)):

        self.db.session.add (set)
        self.db.session.add (sub)
        self.db.session.add (doc)
        self.db.session.commit ()

    def assert_models_basic (self, (set, sub, doc)):

        self.assertIsNone (set.base)
        self.assertIs (sub.base, set)
        self.assertIs (doc.base, set)

        self.assertIsNone (set.root)
        self.assertIs (sub.root, set)
        self.assertIs (doc.root, sub)

    def assert_models_relations (self, (set, sub, doc)):

        self.assertEqual (set.sets.all (), [sub])
        self.assertEqual (set.subsets.all (), [sub])
        self.assertEqual (set.docs.all (), [])
        self.assertEqual (set.subdocs.all (), [doc])

        self.assertEqual (sub.sets.all (), [])
        self.assertEqual (sub.subsets.all (), [])
        self.assertEqual (sub.docs.all (), [doc])
        self.assertEqual (sub.subdocs.all (), [])

    def test_models_after_commit (self):

        models = self.create_models ()
        self.commit_models (models)
        self.assert_models_basic (models)
        self.assert_models_relations (models)

    def test_models_before_commit (self):

        models = self.create_models ()
        self.assert_models_basic (models)
        self.assert_models_relations (models)
        self.commit_models (models)

###############################################################################
###############################################################################

class PageTestCase (BaseTestCase):

    def page (self, value = None):

        if value != 'index':
            response = self.app.get ('/%s/?silent=True' % value)
        else:
            response = self.app.get ('/?silent=True')

        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        self.assertEqual (response.status, '200 OK')

        headers = response.headers

        self.assertIsNotNone (headers)
        self.assertEqual (headers['Content-Type'], 'text/html; charset=utf-8')
        self.assertGreater (['Content-Length'], 0)
        self.assertIsNotNone (headers['Set-Cookie'])

        return response

    def test_index (self):
        self.page (value='index')
    def test_home (self):
        self.page (value='home')
    def test_overview (self):
        self.page (value='overview')
    def test_tutorial (self):
        self.page (value='tutorial')
    def test_faq (self):
        self.page (value='faq')
    def test_contact (self):
        self.page (value='contact')

###############################################################################
###############################################################################

class CrudTestCase (BaseTestCase):

    def test_set_root (self):

        response = self.app.get ('/?silent=True')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)

        response = self.app.get ('/sets/root')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        json = self.assert_ajax (response)

        return response, json

    def test_set_create (self):

        _, json = self.test_set_root ()

        set = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first()

        self.assertIsNotNone (set['uuid'])
        response = self.app.post ('/sets', data=dict (
            root_uuid=set['uuid'], mime='application/folder', name='folder'))
        json = self.assert_ajax (response)

        response = self.app.post ('/sets', data=dict (
            root_uuid=None, mime='application/folder', name='folder'))
        json = self.assert_ajax (response)

        return response, json

    def test_set_read (self):

        _, json = self.test_set_root ()

        set = Linq (json['results'])\
            .filter (lambda el: el['mime'] == 'application/project') \
            .first()

        self.assertIsNotNone (set['uuid'])
        response = self.app.get ('/sets?uuid=%s' % set['uuid'])
        json = self.assert_ajax (response)

        return response, json

    def test_set_delete (self):

        _, json = self.test_set_root ()

        set = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first()

        self.assertIsNotNone (set['uuid'])
        response = self.app.delete ('/sets?uuid=%s' % set['uuid'])
        json = self.assert_ajax (response)

        return response, json

    ###########################################################################

    def test_doc_root (self):

        response = self.app.get ('/?silent=True')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)

        response = self.app.get ('/docs')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        json = self.assert_ajax (response)

        return response, json

    def test_doc_create (self):

        _, json = self.test_set_root ()

        set = Linq (json['results'])\
            .filter (lambda el: el['mime'] == 'application/project')\
            .first()

        self.assertIsNotNone (set['uuid'])
        response = self.app.post ('/docs', data = dict (
            root_uuid=set['uuid'], mime='text/plain', name='file', ext='txt'))
        json = self.assert_ajax (response)

        response = self.app.post ('/docs', data = dict (
            root_uuid=None, mime='text/plain', name='file', ext='txt'))
        json = self.assert_ajax (response)

        return response, json

    def test_doc_read (self):

        _, json = self.test_doc_root ()

        doc = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first()

        self.assertIsNotNone (doc['uuid'])
        response = self.app.get ('/docs?uuid=%s' % doc['uuid'])
        json = self.assert_ajax (response)

        return response, json

    def test_doc_delete (self):

        _, json = self.test_doc_root ()

        doc = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'text/plain')\
            .first()

        self.assertIsNotNone (doc['uuid'])
        response = self.app.delete ('/docs?uuid=%s' % doc['uuid'])
        json = self.assert_ajax (response)

        return response, json

    ###########################################################################

    def assert_ajax (self, response):

        self.assertEqual (response.content_type, 'application/json')
        self.assertGreater (response.content_length, 0)
        self.assertIsNotNone (response.data)

        json = loads (response.data)

        self.assertIsNotNone (json)
        self.assertTrue (json['success'])
        self.assertIsNotNone (json['results'])

        return json

###############################################################################
###############################################################################

if __name__ == '__main__':

    unittest.main ()

###############################################################################
###############################################################################
