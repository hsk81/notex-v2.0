__author__ = 'hsk81'

###############################################################################
###############################################################################

from node import Node
from ..ext.db import db

import os.path

###############################################################################
###############################################################################

class Leaf (Node):

    leaf_id = db.Column (db.Integer, db.Sequence ('leaf_id_seq'),
        db.ForeignKey ('node.id', ondelete='CASCADE'),
        index=True, primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (Leaf, self).__init__ (name, root, mime=mime if mime \
            else 'application/leaf', uuid=uuid)

    def __repr__ (self):

        return u'<Leaf@%x: %s>' % (self.id if self.id else 0, self._name)

###############################################################################
###############################################################################

Node.leafs = db.relationship (Leaf, cascade='all, delete-orphan',
    lazy='dynamic', primaryjoin=Node.id==Leaf.root_id)

Node.subleafs = db.relationship (Leaf, cascade='all, delete-orphan',
    lazy='dynamic', primaryjoin=Node.id==Leaf.base_id)

Node.not_leafs = property (lambda self: self.nodes
    .outerjoin (Leaf, Node.id==Leaf.leaf_id)
    .filter_by (leaf_id=None).back ())

Node.not_subleafs = property (lambda self: self.subnodes
    .outerjoin (Leaf, Node.id==Leaf.leaf_id)
    .filter_by (leaf_id=None).back ())

###############################################################################

def do_walk (self, field, path=''):

    path = os.path.join (path, getattr (self, field))
    path = os.path.normpath (path)
    nodes = self.not_leafs.all ()
    leafs = self.leafs.all ()

    yield path, nodes, leafs

    for node in nodes:
        node.walk (field=field, path=path)

Node.walk = do_walk

###############################################################################
###############################################################################
