__author__ = 'hsk81'

###############################################################################
###############################################################################

from meta import Meta
from node import Node
from ..ext import db

###############################################################################
###############################################################################

class Leaf (Node):

    __tablename__ = 'leaf'
    id = db.Column (db.Integer, db.ForeignKey ('node.id'), primary_key=True)
    __mapper_args__ = {'polymorphic_identity': 'leaf'}

    node = db.relationship ('Node', remote_side='Node.id',
        backref=db.backref ('leafs', cascade='all', lazy='dynamic',
            primaryjoin='Leaf.root_id==Node.id'))

    def __init__ (self, root, **kwargs):

        self.meta = kwargs['meta'] if 'meta' in kwargs\
        else Meta (**kwargs)
        if self.meta and not self.meta.mime:
            self.meta.mime = 'application/leaf'

        super (Leaf, self).__init__ (root, **kwargs)

    def __repr__ (self):

        return u'<Leaf %r>' % (self.meta.name if self.meta else self.id)

###############################################################################
###############################################################################
