__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..util import Linq
from base import BaseTestCase

import json as JSON

###############################################################################
###############################################################################

class RestTestCase (BaseTestCase):

    ###########################################################################
    # NodeApi
    ###########################################################################

    def test_node_root (self):

        response = self.app.get ('/?silent=True')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)

        response = self.app.get ('/node/root')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        nodes = self.assert_ajax_with_results (response)

        return response, nodes

    def test_node_create (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.post ('/node', data=dict (
            root_uuid=node['uuid'], mime='application/folder', name='folder'))
        _ = self.assert_ajax_with_result (response)

        response = self.app.post ('/node', data=dict (
            root_uuid=None, mime='application/folder', name='folder'))
        _ = self.assert_ajax_with_result (response)

        return response

    def test_node_read (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.get ('/node?uuid=%s' % node['uuid'])
        _ = self.assert_ajax_with_results (response)

        return response

    def test_node_update (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assert_node (node)

        response = self.app.put ('/node?root_uuid=%s&uuid=%s&name=%s&mime=%s' %
            (node['root_uuid'], node['uuid'], node['name'], node['mime']))
        _ = self.assert_ajax_with_result (response)

        return response

    def test_node_delete (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.delete ('/node?uuid=%s' % node['uuid'])
        _ = self.assert_ajax_with_result (response)

        return response

    ###########################################################################

    def assert_node (self, node):

        self.assertIsNotNone (node['root_uuid'])
        self.assertIsNotNone (node['uuid'])
        self.assertIsNotNone (node['name'])
        self.assertIsNotNone (node['mime'])

    ###########################################################################
    # LeafApi
    ###########################################################################

    def test_leaf_root (self):

        response = self.app.get ('/?silent=True')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)

        response = self.app.get ('/leaf')
        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        leafs = self.assert_ajax_with_results (response)

        return response, leafs

    def test_leaf_create (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'application/project') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.post ('/leaf', data = dict (
            root_uuid=node['uuid'], mime='text/plain', name='file', ext='txt'))
        _ = self.assert_ajax_with_result (response)

        response = self.app.post ('/leaf', data = dict (
            root_uuid=None, mime='text/plain', name='file', ext='txt'))
        _ = self.assert_ajax_with_result (response)

        return response

    def test_leaf_read (self):

        _, leafs = self.test_leaf_root ()
        leaf = Linq (leafs) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (leaf['uuid'])
        response = self.app.get ('/leaf?uuid=%s' % leaf['uuid'])
        _ = self.assert_ajax_with_results (response)

        return response

    def test_leaf_update (self):

        _, leafs = self.test_leaf_root ()
        leaf = Linq (leafs) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assert_leaf (leaf)

        response = self.app.put ('/leaf?root_uuid=%s&uuid=%s&name=%s&mime=%s' %
            (leaf['root_uuid'], leaf['uuid'], leaf['name'], leaf['mime']))
        _ = self.assert_ajax_with_result (response)

        return response

    def test_leaf_delete (self):

        _, leafs = self.test_leaf_root ()
        leaf = Linq (leafs) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (leaf['uuid'])
        response = self.app.delete ('/leaf?uuid=%s' % leaf['uuid'])
        _ = self.assert_ajax_with_result (response)

        return response

    ###########################################################################

    def assert_leaf (self, leaf):

        self.assertIsNotNone (leaf['root_uuid'])
        self.assertIsNotNone (leaf['uuid'])
        self.assertIsNotNone (leaf['name'])
        self.assertIsNotNone (leaf['mime'])

    ###########################################################################
    # PropertyApi
    ###########################################################################

    def test_property_create (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (node['uuid'])

        response = self.app.post ('/property', data=dict (
            node_uuid=node['uuid'],
            type='string-property',
            mime='text/plain',
            name='description',
            data='...'))

        prop = self.assert_ajax_with_result (response)
        self.assert_prop (prop)

        return response, prop

    def test_property_read (self):

        _, nodes = self.test_node_root ()
        node = Linq (nodes) \
            .filter (lambda el: el['mime'] == 'text/plain') \
            .first ()

        self.assertIsNotNone (node['uuid'])
        response = self.app.get ('/node?uuid=%s' % node['uuid'])
        props = self.assert_ajax_with_results (response)
        map (self.assert_prop, props)

        return response, props

    def test_property_update (self):

        _, prop = self.test_property_create ()
        self.assert_prop (prop)

        response = self.app.put (
            '/property?node_uuid=%s&uuid=%s&type=%s&mime=%s&name=%s&data=%s' % (
                prop['node_uuid'],
                prop['uuid'],
                prop['type'],
                prop['mime'],
                prop['name'],
                prop['data']))

        prop = self.assert_ajax_with_result (response)
        self.assert_prop (prop)

        return response, prop

    def test_property_delete (self):
        pass

    ###########################################################################

    def assert_prop (self, prop):

        self.assertIsNotNone (prop['node_uuid'])
        self.assertIsNotNone (prop['uuid'])
        self.assertIsNotNone (prop['type'])
        self.assertIsNotNone (prop['mime'])
        self.assertIsNotNone (prop['name'])
        self.assertIsNotNone (prop['data'])

    ###########################################################################
    # Helpers
    ###########################################################################

    def assert_ajax (self, response):

        self.assertEqual (response.content_type, 'application/json')
        self.assertGreater (response.content_length, 0)
        self.assertIsNotNone (response.data)

        json = JSON.loads (response.data)
        self.assertIsNotNone (json)
        self.assertTrue (json['success'])

        return json

    def assert_ajax_with_result (self, response):

        json = self.assert_ajax (response)
        self.assertIsNotNone (json['result'])

        return json['result']

    def assert_ajax_with_results (self, response):

        json = self.assert_ajax (response)
        self.assertIsNotNone (json['results'])

        return json['results']

###############################################################################
###############################################################################
