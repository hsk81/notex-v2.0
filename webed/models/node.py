__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.ext.hybrid import hybrid_property
from uuid import uuid4 as uuid_random
from ..ext import db, cache

import hashlib
import ujson as JSON

###############################################################################
###############################################################################

class Node (db.Model):
    __mapper_args__ = {'polymorphic_identity':'node', 'polymorphic_on':'type'}

    id = db.Column (db.Integer, db.Sequence ('node_id_seq'), primary_key=True)
    type = db.Column ('type', db.String (16))

    root_id = db.Column (db.Integer, db.ForeignKey (id))
    nodes = db.relationship ('Node',
        cascade='all, delete-orphan', lazy='dynamic',
        primaryjoin='Node.id==Node.root_id',
        backref=db.backref ('root', remote_side=id))

    base_id = db.Column (db.Integer, db.ForeignKey (id))
    subnodes = db.relationship ('Node',
        cascade='all, delete-orphan', lazy='dynamic',
        primaryjoin='Node.id==Node.base_id',
        backref=db.backref ('base', remote_side=id))

    uuid = db.Column (db.String (36), nullable=False, unique=True)
    mime = db.Column (db.String (256), nullable=True)

    @hybrid_property
    def name (self):
        return self._name

    @name.setter
    def name (self, value):

        key = self.make_key (self.uuid, 'rev', 'name')
        if key in cache.memory:
            cache.memory[key]+= 1
        else:
            cache.memory[key] = 0

        self._name = value

    _name = db.Column (db.Unicode (256), nullable=False)

    def __init__ (self, name, root, mime=None, uuid=None):

        self.base = root.base if root and root.base else root
        self.root = root

        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name) if name is not None else None
        self.mime = mime if mime else 'application/node'

    def __repr__ (self):

        return u'<Node&%05x: %s>' % (self.id, self.name)

    def get_path (self, field):

        if self.root:
            key = self.make_key (self.root.uuid, 'rev', field)
            rev = cache.memory[key] if key in cache.memory else 0
            key = self.make_key (self.root.uuid, field, rev)

            if key in cache.memory:
                root_path = cache.memory[key]
            else:
                root_path = cache.memory[key] = self.root.get_path (field)

            return root_path + [eval ('self.' + field)]
        else:
            return [eval ('self.' + field)]

    def make_key (self, *args):

        string = JSON.encode (args)
        hashed = hashlib.md5 (string)
        return hashed.hexdigest ()

###############################################################################
###############################################################################
