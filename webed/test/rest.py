__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..util import Linq
from base import BaseTestCase

import json as JSON

###############################################################################
###############################################################################

class RestTestCase (BaseTestCase):

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
            .first ()

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

        set = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (set['uuid'])
        response = self.app.get ('/sets?uuid=%s' % set['uuid'])
        json = self.assert_ajax (response)

        return response, json

    def test_set_delete (self):

        _, json = self.test_set_root ()

        set = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

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

        set = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

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
            .first ()

        self.assertIsNotNone (doc['uuid'])
        response = self.app.get ('/docs?uuid=%s' % doc['uuid'])
        json = self.assert_ajax (response)

        return response, json

    def test_doc_delete (self):

        _, json = self.test_doc_root ()

        doc = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (doc['uuid'])
        response = self.app.delete ('/docs?uuid=%s' % doc['uuid'])
        json = self.assert_ajax (response)

        return response, json

    ###########################################################################

    def assert_ajax (self, response):

        self.assertEqual (response.content_type, 'application/json')
        self.assertGreater (response.content_length, 0)
        self.assertIsNotNone (response.data)

        json = JSON.loads (response.data)

        self.assertIsNotNone (json)
        self.assertTrue (json['success'])
        self.assertIsNotNone (json['results'])

        return json

###############################################################################
###############################################################################
