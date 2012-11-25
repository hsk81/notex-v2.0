__author__ = 'hsk81'

###############################################################################
###############################################################################

from leaf import Leaf
from ..ext import db

###############################################################################
###############################################################################

class Doc (Leaf):
    __mapper_args__ = {'polymorphic_identity': 'doc'}

    doc_id = db.Column (db.Integer, db.ForeignKey ('leaf.leaf_id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (Doc, self).__init__ (name, root, mime=mime if mime \
            else 'application/doc', uuid=uuid)

    def __repr__ (self):

        return u'<Doc %r>' % self.name

###############################################################################
###############################################################################
