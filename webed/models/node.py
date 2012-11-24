__author__ = 'hsk81'

###############################################################################
###############################################################################

from meta import Meta
from ..ext import db

###############################################################################
###############################################################################

class Node (db.Model):

    __tablename__ = 'node'
    id = db.Column (db.Integer, primary_key=True)
    type = db.Column ('type', db.String (16))
    __mapper_args__ = {'polymorphic_identity': 'node', 'polymorphic_on': type}

    root_id = db.Column (db.Integer, db.ForeignKey ('node.id'), nullable=True)
    root = db.relationship ('Node', remote_side='Node.id',
        backref=db.backref ('nodes', cascade='all', lazy='dynamic',
            primaryjoin='Node.root_id==Node.id'))

    meta_id = db.Column (db.Integer, db.ForeignKey ('meta.id'), nullable=True)
    meta = db.relationship ('Meta', remote_side='Meta.id')

    def __init__ (self, root, **kwargs):

        self.meta = kwargs['meta'] if 'meta' in kwargs \
            else Meta (**kwargs)
        if self.meta and not self.meta.mime:
            self.meta.mime = 'application/node'

        self.root = root

    def __repr__ (self):

        return u'<Node %r>' % (self.meta.name if self.meta else self.id)

###############################################################################
###############################################################################
