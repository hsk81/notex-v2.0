__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase

from ..models import *
from ..ext import db

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

        self.assertEqual (frozenset (base.subnodes.all ()),
            frozenset ([info, leaf, node]))
        self.assertEqual (frozenset (base.nodes.all ()),
            frozenset ([info, node]))
        self.assertEqual (frozenset (base.leafs.all ()),
            frozenset ([info]))

        self.assertEqual (frozenset (node.subnodes.all ()), frozenset ([]))
        self.assertEqual (frozenset (node.nodes.all ()), frozenset ([leaf]))
        self.assertEqual (frozenset (node.leafs.all ()), frozenset ([leaf]))

        self.assertEqual (frozenset (leaf.subnodes.all ()), frozenset ([]))
        self.assertEqual (frozenset (leaf.nodes.all ()), frozenset ([]))
        self.assertEqual (frozenset (leaf.leafs.all ()), frozenset ([]))

    def test_polymorphic (self):
        base, info, node, leaf = self.create ()
        self.commit ([base, info, node, leaf])

        info, node = sorted (base.nodes.all (), key=lambda n: n.type)
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

class PropertyModelsTestCase (BaseTestCase):

    def test_property (self):

        node = Node ('node', root=None)
        self.db.session.add (node)

        prop = Property ('property', node=node)
        self.db.session.add (prop)
        self.db.session.commit ()

        [prop] = node.props.all ()

        self.assertIsNotNone (prop)
        self.assertEqual (prop.name, 'property')
        self.assertEqual (prop.type, 'Property')
        self.assertEqual (prop.node, node)

    def test_string_property (self):

        node = Node ('node', root=None)
        self.db.session.add (node)

        prop = StringProperty ('string', data=u'...', node=node)
        self.db.session.add (prop)
        self.db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), StringProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, StringProperty))

        self.assertEqual (prop.name, 'string')
        self.assertEqual (prop.type, 'StringProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data, u'...')
        self.assertEqual (type (prop.data), unicode)

    def test_text_property (self):

        node = Node ('node', root=None)
        self.db.session.add (node)

        prop = TextProperty ('text', data=u'...', node=node)
        self.db.session.add (prop)
        self.db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), TextProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, TextProperty))

        self.assertEqual (prop.name, 'text')
        self.assertEqual (prop.type, 'TextProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data, u'...')
        self.assertEqual (type (prop.data), unicode)

    def test_base64_property (self):

        node = Node ('node', root=None)
        self.db.session.add (node)

        prop = Base64Property ('base64', data= '...', node=node)
        self.db.session.add (prop)
        self.db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), Base64Property)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, Base64Property))

        self.assertEqual (prop.name, 'base64')
        self.assertEqual (prop.type, 'Base64Property')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data,
            'data:application/octet-stream;base64,Li4u\n')
        self.assertEqual (type (prop.data), str)

###############################################################################
###############################################################################
