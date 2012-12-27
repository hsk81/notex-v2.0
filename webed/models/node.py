__author__ = 'hsk81'

###############################################################################
###############################################################################

from uuid import uuid4 as uuid_random
from ..ext import db, cache

from sqlalchemy.ext.hybrid import hybrid_property

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

    uuid_path = db.Column (db.PickleType, nullable=False, unique=True)
    uuid = db.Column (db.String (36), nullable=False, unique=True)
    mime = db.Column (db.String (256), nullable=True)

    @hybrid_property
    def name (self):
        return self._name

    @name.setter
    def name (self, value):

        if self.root:

            ##
            ## TODO: Use faster invalidation of memcached/redit!
            ##

            root_path = '/'.join (self.root.uuid_path)
            def relevant ((uuid_path, field)):

                if field != 'name': return False
                return '/'.join (uuid_path).startswith (root_path)

            for uuid_path, field in filter (relevant, cache.memory):
                key = frozenset ((frozenset (uuid_path), field))
                if key in cache.memory: del cache.memory[key]

        self._name = value

    _name = db.Column (db.Unicode (256), nullable=False)

    def __init__ (self, name, root, mime=None, uuid=None):

        self.base = root.base if root and root.base else root
        self.root = root

        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name) if name is not None else None
        self.mime = mime if mime else 'application/node'

        self.uuid_path = self.get_path (field='uuid')

    def __repr__ (self):

        return u'<Node&%05x: %s>' % (self.id, self.name)

    def get_path (self, field):

        if self.root:
            key = frozenset ((frozenset (self.root.uuid_path), field))
            if key in cache.memory:
                root_path = cache.memory[key]
            else:
                root_path = cache.memory[key] = self.root.get_path (field)

            return root_path + [eval ('self.' + field)]
        else:
            return [eval ('self.' + field)]

###############################################################################
###############################################################################
