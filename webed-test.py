#!bin/python

###############################################################################
###############################################################################

from json import loads

import webed
import unittest

###############################################################################
###############################################################################

class WebedTestCase (unittest.TestCase):

    def setUp (self):

        webed.app.config['TESTING'] = True
        webed.app.config['DEBUG'] = False

        SITE_ROOT = webed.app.config['SITE_ROOT']
        assert SITE_ROOT
        SITE_NAME = webed.app.config['SITE_NAME']
        assert SITE_NAME

        webed.app.config['SQLALCHEMY_DATABASE_URI'] = \
            'sqlite:///%s/%s-test.db' % (SITE_ROOT, SITE_NAME)

        self.app = webed.app.test_client ()
        self.db = webed.db

        self.db.create_all ()

    def tearDown (self):

        self.db.session.remove ()
        self.db.drop_all ()

    def create_models (self):

        set = webed.Set ('root', root=None)
        sub = webed.Set ('folder', root=set)
        doc = webed.Doc ('file', 'txt', root=sub)

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

    def page (self, value = None):

        if value != 'index':
            response = self.app.get ('/%s/?silent=True' % value)
        else:
            response = self.app.get ('/?silent=True')

        assert response
        assert response.status_code == 200
        assert response.status == '200 OK'

        assert response.headers
        assert response.headers['Content-Type'] == 'text/html; charset=utf-8'
        assert response.headers['Content-Length'] > 0
        assert response.headers['Set-Cookie']

        return response

    def test_pages (self):

        self.page (value='index')
        self.page (value='home')
        self.page (value='overview')
        self.page (value='tutorial')
        self.page (value='faq')
        self.page (value='contact')

    def test_node_root (self):

        response = self.page (value='index')
        assert response

        response = self.app.get ('/node/root')
        assert response
        assert response.status_code == 200
        assert response.content_type == 'application/json'
        assert response.content_length > 0
        assert response.data

        json = loads (response.data)
        assert json
        assert json['success']
        assert json['results'] and len (json['results']) > 0

        return response, json

###############################################################################
###############################################################################

if __name__ == '__main__':

    unittest.main ()

###############################################################################
###############################################################################
