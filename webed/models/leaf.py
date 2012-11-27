__author__ = 'hsk81'

###############################################################################
###############################################################################

from node import Node
from ..ext import db

###############################################################################
###############################################################################

class Leaf (Node):
    __mapper_args__ = {'polymorphic_identity': 'leaf'}

    leaf_id = db.Column (db.Integer, db.ForeignKey ('node.id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (Leaf, self).__init__ (name, root, mime=mime if mime \
            else 'application/leaf', uuid=uuid)

    def __repr__ (self):

        return u'<Leaf @ %r: %r>' % (self.id, self.name)

###############################################################################
###############################################################################

Node.leafs = db.relationship (Leaf, cascade='all', lazy='dynamic',
    primaryjoin=Node.id==Leaf.root_id)

Node.subleafs = db.relationship (Leaf, cascade='all', lazy='dynamic',
    primaryjoin=Node.id==Leaf.base_id)

Node.not_leafs = property (lambda self: self.nodes
    .outerjoin (Leaf, Node.id==Leaf.leaf_id)
    .filter (Leaf.id==None))

Node.not_subleafs = property (lambda self: self.subnodes
    .outerjoin (Leaf, Node.id==Leaf.leaf_id)
    .filter (Leaf.id==None))

###############################################################################
###############################################################################
