__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase
from ..models import *

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

    def create (self):

        base = Node ('base', root=None)
        info = Leaf ('info', root=base)
        node = Node ('node', root=base)
        leaf = Leaf ('leaf', root=node)

        return [base, info, node, leaf]

    def commit (self, objects):
        self.db.session.add_all (objects)
        self.db.session.commit ()

    def test (self):
        base, info, node, leaf = self.create ()
        self.commit ([base, info, node, leaf])

        self.assertIsNone (base.base)
        self.assertIs (info.base, base)
        self.assertIs (node.base, base)
        self.assertIs (leaf.base, base)

        self.assertIsNone (base.root)
        self.assertIs (info.root, base)
        self.assertIs (node.root, base)
        self.assertIs (leaf.root, node)

        self.assertEqual (base.tree.all (), [info, node, leaf])
        self.assertEqual (base.nodes.all (), [info, node])
        self.assertEqual (base.leafs.all (), [info])

        self.assertEqual (node.tree.all (), [])
        self.assertEqual (node.nodes.all (), [leaf])
        self.assertEqual (node.leafs.all (), [leaf])

        self.assertEqual (leaf.tree.all (), [])
        self.assertEqual (leaf.nodes.all (), [])
        self.assertEqual (leaf.leafs.all (), [])

    def test_polymorphic (self):
        base, info, node, leaf = self.create ()
        self.commit ([base, info, node, leaf])

        info, node = base.nodes.all ()

        self.assertEqual (type (info), Leaf)
        self.assertTrue (isinstance (info, Node))
        self.assertTrue (isinstance (info, Leaf))

        self.assertEqual (type (node), Node)
        self.assertTrue (isinstance (node, Node))
        self.assertFalse (isinstance (node, Leaf))

    def test_delete (self):
        base, info, node, leaf = self.create ()

        self.db.session.add_all ([base, info, node, leaf])
        self.db.session.commit ()
        self.db.session.delete (base)
        self.db.session.commit ()

        base = Node.query.get (base.id)
        self.assertIsNone (base)
        info = Leaf.query.get (info.id)
        self.assertIsNone (info)
        node = Node.query.get (node.id)
        self.assertIsNone (node)
        leaf = Leaf.query.get (leaf.id)
        self.assertIsNone (leaf)

###############################################################################
###############################################################################
