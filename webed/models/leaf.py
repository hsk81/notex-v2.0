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

        return u'<Leaf %r>' % (self.name if self.name else self.leaf_id)

###############################################################################
###############################################################################
