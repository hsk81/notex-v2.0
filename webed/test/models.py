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

    def create_objects (self):

        root = Node ('root', root=None)
        node = Node ('node', root=root)
        leaf = Leaf ('leaf', root=node)

        return [root, node, leaf]

    def commit_objects (self, objects):

        self.db.session.add_all (objects)
        self.db.session.commit ()

    def test_basic (self):
        root, node, leaf = self.create_objects ()
        self.commit_objects ([root, node, leaf])

        self.assertIsNone (root.root)
        self.assertIs (node.root, root)
        self.assertIs (leaf.root, node)

    def test_node_relations (self):
        root, node, leaf = self.create_objects ()
        self.commit_objects ([root, node, leaf])

        self.assertEqual (root.nodes.all (), [node])
        self.assertEqual (node.nodes.all (), [leaf])
        self.assertEqual (leaf.nodes.all (), [])

    def test_leaf_relations (self):
        root, node, leaf = self.create_objects ()
        self.commit_objects ([root, node, leaf])

        self.assertEqual (root.leafs.all (), [])
        self.assertEqual (node.leafs.all (), [leaf])
        self.assertEqual (leaf.leafs.all (), [])

###############################################################################
###############################################################################
