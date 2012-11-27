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

class NodeEx (Node):
    __mapper_args__ = {'polymorphic_identity': 'node-ex'}

    nodeex_id = db.Column (db.Integer, db.ForeignKey ('node.id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (NodeEx, self).__init__ (name, root, mime=mime if mime \
            else 'application/node-ex', uuid=uuid)

    def __repr__ (self):

        return u'<NodeEx @ %r: %r>' % (self.id, self.name)

class LeafEx (Leaf):
    __mapper_args__ = {'polymorphic_identity': 'leaf-ex'}

    leafex_id = db.Column (db.Integer, db.ForeignKey ('leaf.leaf_id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (LeafEx, self).__init__ (name, root, mime=mime if mime \
            else 'application/leaf-ex', uuid=uuid)

    def __repr__ (self):

        return u'<LeafEx @ %r: %r>' % (self.id, self.name)

###############################################################################
###############################################################################

class ExtendedModelsTestCase (BaseTestCase):

    def test_polymorphic (self):

        base = Node ('base', root=None)
        self.db.session.add (base)

        leaf = LeafEx ('leaf-l0', root=base)
        self.db.session.add (leaf)
        node = NodeEx ('node-l0', root=base)
        self.db.session.add (node)

        leaf = Leaf ('leaf-l1', root=node)
        self.db.session.add (leaf)
        node = Node ('node-l1', root=node)
        self.db.session.add (node)

        leaf = LeafEx ('leaf-l2', root=node)
        self.db.session.add (leaf)
        node = NodeEx ('node-l2', root=node)
        self.db.session.add (node)

        self.db.session.commit ()

        [leaf] = base.leafs.all ()
        self.assertEqual (type (leaf), LeafEx)
        self.assertTrue (isinstance (leaf, Node))
        self.assertTrue (isinstance (leaf, Leaf))

        [node] = base.not_leafs.all ()
        self.assertEqual (type (node), NodeEx)
        self.assertTrue (isinstance (node, Node))
        self.assertFalse (isinstance (node, Leaf))

        [ll0, ll1, ll2] = base.subleafs.all ()
        self.assertEqual (type (ll0), LeafEx)
        self.assertEqual (type (ll1), Leaf)
        self.assertEqual (type (ll2), LeafEx)

        [nl0, nl1, nl2] = base.not_subleafs.all ()
        self.assertEqual (type (nl0), NodeEx)
        self.assertEqual (type (nl1), Node)
        self.assertEqual (type (nl2), NodeEx)

###############################################################################
###############################################################################
