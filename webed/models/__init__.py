__author__ = 'hsk81'

###############################################################################
###############################################################################

from set import *
from doc import *
from user import *

###############################################################################
###############################################################################

from ..ext import db

###############################################################################
###############################################################################

class Meta (db.Model):

    __tablename__ = 'meta'
    id = db.Column (db.Integer, primary_key=True)
    type = db.Column ('type', db.String (16))
    __mapper_args__ = {'polymorphic_identity': 'meta', 'polymorphic_on': type}

    uuid = db.Column (db.String (32), nullable=False, unique=True)
    mime = db.Column (db.String (256), nullable=True)
    name = db.Column (db.Unicode (256), nullable=True)

    def __init__ (self, name=None, mime=None, uuid=None):

        self.uuid = uuid.hex if uuid else str (uuid_random ().hex)
        self.name = unicode (name) if name else None
        self.mime = mime if mime else None

class Node (db.Model):

    __tablename__ = 'node'
    id = db.Column (db.Integer, primary_key=True)
    type = db.Column ('type', db.String (16))
    __mapper_args__ = {'polymorphic_identity': 'node', 'polymorphic_on': type}

    root_id = db.Column (db.Integer, db.ForeignKey ('node.id'), nullable=True)
    root = db.relationship ('Node', remote_side='Node.id',
        backref=db.backref ('nodes', cascade='all', lazy='dynamic',
            primaryjoin='Node.root_id==Node.id'))

    def __init__ (self, root, **kwargs):

        self.meta = kwargs['meta'] if 'meta' in kwargs \
            else Meta (**kwargs)
        if self.meta and not self.meta.mime:
            self.meta.mime = 'application/node'

        self.root = root

    def __repr__ (self):

        return u'<Node %r>' % self.id

class Leaf (Node):

    __tablename__ = 'leaf'
    id = db.Column (db.Integer, db.ForeignKey ('node.id'), primary_key=True)
    __mapper_args__ = {'polymorphic_identity': 'leaf'}

    node = db.relationship ('Node', remote_side='Node.id',
        backref=db.backref ('leafs', cascade='all', lazy='dynamic',
            primaryjoin='Leaf.root_id==Node.id'))

    def __init__ (self, root, **kwargs):

        self.meta = kwargs['meta'] if 'meta' in kwargs \
            else Meta (**kwargs)
        if self.meta and not self.meta.mime:
            self.meta.mime = 'application/leaf'

        super (Leaf, self).__init__ (root, **kwargs)

    def __repr__ (self):

        return u'<Leaf %r>' % self.name

###############################################################################
###############################################################################
