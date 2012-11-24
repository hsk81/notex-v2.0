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

class Node (db.Model):

    __tablename__ = 'node'
    id = db.Column (db.Integer, primary_key=True)
    type = db.Column ('type', db.String (64))
    __mapper_args__ = {'polymorphic_identity': 'node', 'polymorphic_on': type}

    uuid = db.Column (db.String (36), unique=True)
    mime = db.Column (db.String (256))
    name = db.Column (db.Unicode (256))

    root_id = db.Column (db.Integer, db.ForeignKey ('node.id'), nullable=True)
    root = db.relationship ('Node', remote_side='Node.id',
        backref=db.backref ('nodes', cascade='all', lazy='dynamic',
            primaryjoin='Node.root_id==Node.id'))

    def __init__ (self, name, root, uuid=None, mime=None):

        self.uuid = uuid if uuid else str (uuid_random ())
        self.mime = mime if mime else 'application/node'
        self.name = unicode (name)
        self.root = root

    def __repr__ (self):

        return u'<Node %r>' % self.name

class Leaf (Node):

    __tablename__ = 'leaf'
    id = db.Column (db.Integer, db.ForeignKey ('node.id'), primary_key=True)
    __mapper_args__ = {'polymorphic_identity': 'leaf'}

    node = db.relationship ('Node', remote_side='Node.id',
        backref=db.backref ('leafs', cascade='all', lazy='dynamic',
            primaryjoin='Leaf.root_id==Node.id'))

    def __init__ (self, name, root, uuid=None, mime=None):

        super (Leaf, self).__init__ (name, root, uuid=uuid, mime=mime \
            if mime else 'application/leaf')

    def __repr__ (self):

        return u'<Leaf %r>' % self.name

###############################################################################
###############################################################################
