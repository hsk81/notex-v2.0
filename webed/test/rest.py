__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..util import Linq
from base import BaseTestCase

import json as JSON

###############################################################################
###############################################################################

class RestTestCase (BaseTestCase):

    def test_node_root (self):

        response = self.app.get ('/?silent=True')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)

        response = self.app.get ('/node/root')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        json = self.assert_ajax (response)

        return response, json

    def test_node_create (self):

        _, json = self.test_node_root ()

        node = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.post ('/node', data=dict (
            root_uuid=node['uuid'], mime='application/folder', name='folder'))
        json = self.assert_ajax (response)

        response = self.app.post ('/node', data=dict (
            root_uuid=None, mime='application/folder', name='folder'))
        json = self.assert_ajax (response)

        return response, json

    def test_node_read (self):

        _, json = self.test_node_root ()

        node = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.get ('/node?uuid=%s' % node['uuid'])
        json = self.assert_ajax (response)

        return response, json

    def test_node_update (self):

        _, json = self.test_node_root ()

        node = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['root_uuid'])
        self.assertIsNotNone (node['uuid'])
        self.assertIsNotNone (node['name'])
        self.assertIsNotNone (node['mime'])

        response = self.app.put ('/node?root_uuid=%s&uuid=%s&name=%s&mime=%s' %
            (node['root_uuid'], node['uuid'], node['name'], node['mime']))
        json = self.assert_ajax (response)

        return response, json

    def test_node_delete (self):

        _, json = self.test_node_root ()

        node = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.delete ('/node?uuid=%s' % node['uuid'])
        json = self.assert_ajax (response)

        return response, json

    ###########################################################################

    def test_leaf_root (self):

        response = self.app.get ('/?silent=True')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)

        response = self.app.get ('/leaf')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        json = self.assert_ajax (response)

        return response, json

    def test_leaf_create (self):

        _, json = self.test_node_root ()

        node = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.post ('/leaf', data = dict (
            root_uuid=node['uuid'], mime='text/plain', name='file', ext='txt'))
        json = self.assert_ajax (response)

        response = self.app.post ('/leaf', data = dict (
            root_uuid=None, mime='text/plain', name='file', ext='txt'))
        json = self.assert_ajax (response)

        return response, json

    def test_leaf_read (self):

        _, json = self.test_leaf_root ()

        leaf = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (leaf['uuid'])
        response = self.app.get ('/leaf?uuid=%s' % leaf['uuid'])
        json = self.assert_ajax (response)

        return response, json

    def test_leaf_update (self):

        _, json = self.test_leaf_root ()

        leaf = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (leaf['root_uuid'])
        self.assertIsNotNone (leaf['uuid'])
        self.assertIsNotNone (leaf['name'])
        self.assertIsNotNone (leaf['mime'])

        response = self.app.put ('/leaf?root_uuid=%s&uuid=%s&name=%s&mime=%s' %
            (leaf['root_uuid'], leaf['uuid'], leaf['name'], leaf['mime']))
        json = self.assert_ajax (response)

        return response, json

    def test_leaf_delete (self):

        _, json = self.test_leaf_root ()

        leaf = Linq (json['results']) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (leaf['uuid'])
        response = self.app.delete ('/leaf?uuid=%s' % leaf['uuid'])
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

        self.assertTrue ('results' in json or 'result' in json)
        if 'results' in json: self.assertIsNotNone (json['results'])
        if 'result' in json: self.assertIsNotNone (json['result'])

        return json

###############################################################################
###############################################################################
