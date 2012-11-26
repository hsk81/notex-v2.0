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

class LeafEx (Leaf):
    __mapper_args__ = {'polymorphic_identity': 'leafex'}

    leafex_id = db.Column (db.Integer, db.ForeignKey ('leaf.leaf_id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (LeafEx, self).__init__ (name, root, mime=mime if mime \
            else 'application/leaf-ex', uuid=uuid)

    def __repr__ (self):

        return u'<LeafEx @ %r: %r>' % (self.id, self.name)

###############################################################################
###############################################################################
