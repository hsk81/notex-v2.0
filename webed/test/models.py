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
        db.session.add_all (objects)
        db.session.commit ()

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

        db.session.add_all ([base, info, node, leaf])
        db.session.commit ()
        db.session.delete (base)
        db.session.commit ()

        base = Node.query.get (base.id)
        self.assertIsNone (base)
        info = Leaf.query.get (info.id)
        self.assertIsNone (info)
        node = Node.query.get (node.id)
        self.assertIsNone (node)
        leaf = Leaf.query.get (leaf.id)
        self.assertIsNone (leaf)

    def test_walking (self):

        node_l0 = Node ('node-l0', root=None)
        db.session.add (node_l0)
        leaf_l0 = Leaf ('leaf-l0', root=node_l0)
        db.session.add (leaf_l0)

        node_l1 = Node ('node-l1', root=node_l0)
        db.session.add (node_l1)
        leaf_l10 = Leaf ('leaf-l10', root=node_l1)
        db.session.add (leaf_l10)
        node_l10 = Node ('node-l10', root=node_l1)
        db.session.add (node_l10)
        leaf_l11 = Leaf ('leaf-l11', root=node_l1)
        db.session.add (leaf_l11)
        node_l11 = Node ('node-l11', root=node_l1)
        db.session.add (node_l11)

        node_l2 = Node ('node-l2', root=node_l0)
        db.session.add (node_l2)
        leaf_l20 = Leaf ('leaf-l20', root=node_l2)
        db.session.add (leaf_l20)
        node_l20 = Node ('node-l20', root=node_l2)
        db.session.add (node_l20)
        leaf_l21 = Leaf ('leaf-l21', root=node_l2)
        db.session.add (leaf_l21)
        node_l21 = Node ('node-l21', root=node_l2)
        db.session.add (node_l21)

        db.commit ()

        for path, nodes, leafs in node_l0.walk ('name'):

            self.assertIsNotNone (path)
            self.assertIsNotNone (nodes)
            self.assertGreater (len (nodes), 0)
            self.assertIsNotNone (leafs)
            self.assertGreater (len (leafs), 0)

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

        return u'<NodeEx @ %r>' % self.id

class LeafEx (Leaf):
    __mapper_args__ = {'polymorphic_identity': 'leaf-ex'}

    leafex_id = db.Column (db.Integer, db.ForeignKey ('leaf.leaf_id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (LeafEx, self).__init__ (name, root, mime=mime if mime \
            else 'application/leaf-ex', uuid=uuid)

    def __repr__ (self):

        return u'<LeafEx @ %r>' % self.id

###############################################################################
###############################################################################

class ExtendedModelsTestCase (BaseTestCase):

    def test_polymorphic (self):

        base = Node ('base', root=None)
        db.session.add (base)

        leaf = LeafEx ('leaf-l0', root=base)
        db.session.add (leaf)
        node = NodeEx ('node-l0', root=base)
        db.session.add (node)

        leaf = Leaf ('leaf-l1', root=node)
        db.session.add (leaf)
        node = Node ('node-l1', root=node)
        db.session.add (node)

        leaf = LeafEx ('leaf-l2', root=node)
        db.session.add (leaf)
        node = NodeEx ('node-l2', root=node)
        db.session.add (node)

        db.session.commit ()

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
        db.session.add (node)

        prop = Property ('property', node=node)
        db.session.add (prop)
        db.session.commit ()

        [prop] = node.props.all ()

        self.assertIsNotNone (prop)
        self.assertEqual (prop.name, 'property')
        self.assertEqual (prop.type, 'Property')
        self.assertEqual (prop.node, node)

    def test_string_property (self):

        node = Node ('node', root=None)
        db.session.add (node)

        prop = StringProperty ('string', data=u'...', node=node)
        db.session.add (prop)
        db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), StringProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, StringProperty))

        self.assertEqual (prop.name, 'string')
        self.assertEqual (prop.type, 'StringProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data, u'...')
        self.assertEqual (type (prop.data), unicode)

    def test_vcs_text_property (self):

        node = Node ('node', root=None)
        db.session.add (node)

        prop = TextVcsProperty ('text', data=u'...', node=node)
        db.session.add (prop)
        db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), TextVcsProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, TextVcsProperty))

        self.assertEqual (prop.name, 'text')
        self.assertEqual (prop.type, 'TextVcsProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data, u'...')
        self.assertEqual (type (prop.data), unicode)

    def test_cow_text_property (self):

        node = Node ('node', root=None)
        db.session.add (node)

        prop = TextCowProperty ('text', data=u'...', node=node)
        db.session.add (prop)
        db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), TextCowProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, TextCowProperty))

        self.assertEqual (prop.name, 'text')
        self.assertEqual (prop.type, 'TextCowProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data, u'...')
        self.assertEqual (type (prop.data), unicode)

    def test_vcs_base64_property (self):

        node = Node ('node', root=None)
        db.session.add (node)

        prop = Base64VcsProperty ('base64', data='...', node=node)
        db.session.add (prop)
        db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), Base64VcsProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, Base64VcsProperty))

        self.assertEqual (prop.name, 'base64')
        self.assertEqual (prop.type, 'Base64VcsProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data,
            'data:application/octet-stream;base64,Li4u\n')
        self.assertEqual (type (prop.data), str)

    def test_cow_base64_property (self):

        node = Node ('node', root=None)
        db.session.add (node)

        prop = Base64CowProperty ('base64', data='...', node=node)
        db.session.add (prop)
        db.session.commit ()

        [prop] = node.props.all ()

        self.assertEqual (type (prop), Base64CowProperty)
        self.assertTrue (isinstance (prop, Property))
        self.assertTrue (isinstance (prop, Base64CowProperty))

        self.assertEqual (prop.name, 'base64')
        self.assertEqual (prop.type, 'Base64CowProperty')
        self.assertEqual (prop.node, node)
        self.assertEqual (prop.data,
            'data:application/octet-stream;base64,Li4u\n')
        self.assertEqual (type (prop.data), str)

###############################################################################
###############################################################################
