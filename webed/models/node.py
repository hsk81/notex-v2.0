__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.dialects import postgres as pg
from uuid import uuid4 as uuid_random

from ..ext.db import db
from ..ext.cache import cache

import os.path

###############################################################################
###############################################################################

class Node (db.Model):
    __mapper_args__ = {'polymorphic_identity':'node', 'polymorphic_on':'type'}

    id = db.Column (db.Integer, db.Sequence ('node_id_seq'), primary_key=True,
        index=True)
    type = db.Column ('type', db.String (16), nullable=False,
        index=False)

    ###########################################################################

    root_id = db.Column (db.Integer, db.ForeignKey (id, ondelete='CASCADE'),
        index=True)
    base_id = db.Column (db.Integer, db.ForeignKey (id, ondelete='CASCADE'),
        index=True)

    nodes = db.relationship ('Node',
        cascade='all, delete-orphan', lazy='dynamic',
        primaryjoin='Node.id==Node.root_id',
        backref=db.backref ('root', remote_side=id))

    subnodes = db.relationship ('Node',
        cascade='all, delete-orphan', lazy='dynamic',
        primaryjoin='Node.id==Node.base_id',
        backref=db.backref ('base', remote_side=id))

    ###########################################################################

    _uuid = db.Column (pg.UUID, nullable=False, index=True, unique=True,
        name = 'uuid')
    _mime = db.Column (db.String (), nullable=False, index=False,
        name = 'mime')
    _name = db.Column (db.Unicode (), nullable=False, index=False,
        name = 'name')

    ###########################################################################

    @hybrid_property
    def uuid (self):
        return self._uuid

    @hybrid_property
    def mime (self):
        return self._mime
    @mime.setter
    def mime (self, value):
        self._mime = value

    @hybrid_property
    def name (self):
        return self._name
    @name.setter
    def name (self, value):
        self._name = value

    ###########################################################################

    def __init__ (self, name, root, mime=None, uuid=None):

        self.base = root.base if root and root.base else root
        self.root = root

        self._mime = mime if mime else 'application/node'
        self._uuid = uuid if uuid else str (uuid_random ())
        self._name = unicode (name) if name is not None else None

    def __repr__ (self):

        return u'<Node@%x: %s>' % (self.id if self.id else 0, self._name)

    ###########################################################################

    def get_path (self, field):

        @cache.version (key=[self.uuid, 'path', field])
        def cached_path (self, field):

            if self.root:
                return self.root.get_path (field) + [getattr (self, field)]
            else:
                return [getattr (self, field)]

        if field == 'uuid':
            return cached_path (self, field)
        else:
            return cached_path.uncached (self, field)

    def uuid_path (self):
        return os.path.sep.join (self.get_path (field='uuid'))

    @hybrid_property
    def name_path (self):
        return os.path.sep.join (self.get_path (field='name'))
    @name_path.expression
    def name_path (cls):
        return NodePath.name_path

    ###########################################################################

    def get_size (self, **kwargs):

        @cache.version (key=[self.uuid, 'size'] + kwargs.values ())
        def cached_size (node, **kwargs):

            props = node.props.filter_by (**kwargs).all ()
            value = reduce (lambda s,p: s+p.size, props, 0)
            value+= reduce (lambda s,n: s+n.get_size (**kwargs), node.nodes, 0)
            return value

        return cached_size (self, **kwargs)

    def size (self):
        return self.get_size (name='data')

###############################################################################
###############################################################################

class NodePath (db.Model):

    id = db.Column (db.Integer, db.Sequence ('node_path_id_seq'),
        primary_key=True)

    base_id = db.Column (db.Integer,
        db.ForeignKey (Node.id, ondelete='CASCADE'), index=True)
    base = db.relationship (Node, foreign_keys=[base_id])

    node_id = db.Column (db.Integer,
        db.ForeignKey (Node.id, ondelete='CASCADE'), index=True)
    node = db.relationship (Node, foreign_keys=[node_id], backref=db.backref (
        'node_path', cascade='all, delete-orphan', uselist=False))

    id_path = db.Column (pg.ARRAY (db.Integer), nullable=False, index=False)
    name_path = db.Column (db.Text (), nullable=False, index=True)

    ###########################################################################

    def __init__ (self, node):

        self.node = node
        self.base = node.base
        self.id_path = node.get_path (field='id')
        self.name_path = node.name_path

    def __repr__ (self):

        return u'<NodePath@%x: %s>' % (self.node_id if self.node_id else 0,
            self.name_path)

###############################################################################
###############################################################################
