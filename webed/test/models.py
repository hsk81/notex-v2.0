__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase
from ..models import *

###############################################################################
###############################################################################

class ModelsTestCase (BaseTestCase):

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

        self.assertEqual (base.subnodes.all (), [info, node, leaf])
        self.assertEqual (base.nodes.all (), [info, node])
        self.assertEqual (base.leafs.all (), [info])

        self.assertEqual (node.subnodes.all (), [])
        self.assertEqual (node.nodes.all (), [leaf])
        self.assertEqual (node.leafs.all (), [leaf])

        self.assertEqual (leaf.subnodes.all (), [])
        self.assertEqual (leaf.nodes.all (), [])
        self.assertEqual (leaf.leafs.all (), [])

    def test_polymorphic (self):
        base, info, node, leaf = self.create ()
        self.commit ([base, info, node, leaf])

        info, node = base.nodes.all ()
        self.assertIsNotNone (info)
        self.assertIsNotNone (node)

        self.assertEqual (type (info), Leaf)
        self.assertTrue (isinstance (info, Node))
        self.assertTrue (isinstance (info, Leaf))

        self.assertEqual (type (node), Node)
        self.assertTrue (isinstance (node, Node))
        self.assertFalse (isinstance (node, Leaf))

    def test_polymorphic_ex (self):

        base, _, node, leaf = self.create ()
        info = LeafEx ('info-ex', root=base)
        self.commit ([base, info, node, leaf])

        [node] = base.only_nodes.all ()
        self.assertIsNotNone (node)

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
