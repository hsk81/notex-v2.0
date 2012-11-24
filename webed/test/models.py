__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..models import Set, Doc
from ..models import Node, Leaf

from base import BaseTestCase

###############################################################################
###############################################################################

class ModelsTestCase (BaseTestCase):

    def create_models (self):

        set = Set ('root', root=None)
        sub = Set ('folder', root=set)
        doc = Doc ('file.txt', root=sub)

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

class TreeTestCase (BaseTestCase):

    def commit_objects (self, objects):

        self.db.session.add_all (objects)
        self.db.session.commit ()

    def create_objects (self):

        root = Node (root=None, name='root')
        meta = Leaf (root=root, name='meta')
        node = Node (root=root, name='node')
        leaf = Leaf (root=node, name='leaf')

        return [root, meta, node, leaf]

    def test_create (self):
        root, meta, node, leaf = self.create_objects ()
        self.commit_objects ([root, meta, node, leaf])

        self.assertIsNone (root.root)
        self.assertIs (meta.root, root)
        self.assertIs (node.root, root)
        self.assertIs (leaf.root, node)

    def delete_objects (self, objects):

        root = objects.pop ()
        self.assertIsNotNone (root)

        self.db.session.delete (root)
        self.db.session.commit ()

    def test_delete_root (self):
        root = Node (root=None, name='root')
        self.db.session.add (root)
        self.db.session.commit ()

        root_id = root.id
        self.assertIsNotNone (root_id)
        self.db.session.delete (root)
        self.db.session.commit ()

        root = Node.query.get (root_id)
        self.assertIsNone (root)

    def test_delete_node (self):
        root = Node (root=None, name='root')
        node = Node (root=root, name='node')
        self.db.session.add (root)
        self.db.session.add (node)
        self.db.session.commit ()

        root_id = root.id
        self.assertIsNotNone (root_id)
        node_id = node.id
        self.assertIsNotNone (node_id)

        self.db.session.delete (root)
        self.db.session.commit ()

        root = Node.query.get (root_id)
        self.assertIsNone (root)
        node = Node.query.get (node_id)
        self.assertIsNone (node)

    def test_delete_leaf (self):
        root = Node (root=None, name='root')
        leaf = Leaf (root=root, name='leaf')
        self.db.session.add (root)
        self.db.session.add (leaf)
        self.db.session.commit ()

        root_id = root.id
        self.assertIsNotNone (root_id)
        leaf_id = leaf.id
        self.assertIsNotNone (leaf_id)

        self.db.session.delete (root)
        self.db.session.commit ()

        root = Node.query.get (root_id)
        self.assertIsNone (root)
        leaf = Node.query.get (leaf_id)
        self.assertIsNone (leaf)

    def test_node_relations (self):
        root, meta, node, leaf = self.create_objects ()
        self.commit_objects ([root, meta, node, leaf])

        self.assertEqual (root.nodes.all (), [meta, node])
        self.assertEqual (meta.nodes.all (), [])
        self.assertEqual (node.nodes.all (), [leaf])
        self.assertEqual (leaf.nodes.all (), [])

    def test_leaf_relations (self):
        root, meta, node, leaf = self.create_objects ()
        self.commit_objects ([root, meta, node, leaf])

        self.assertEqual (root.leafs.all (), [meta])
        self.assertEqual (meta.leafs.all (), [])
        self.assertEqual (node.leafs.all (), [leaf])
        self.assertEqual (leaf.leafs.all (), [])

    def test_polymorphic (self):
        root, meta, node, leaf = self.create_objects ()
        self.commit_objects ([root, meta, node, leaf])

        meta, node = root.nodes.all ()

        self.assertEqual (type (meta), Leaf)
        self.assertTrue (isinstance (meta, Node))
        self.assertTrue (isinstance (meta, Leaf))

        self.assertEqual (type (node), Node)
        self.assertTrue (isinstance (node, Node))
        self.assertFalse (isinstance (node, Leaf))

###############################################################################
###############################################################################
