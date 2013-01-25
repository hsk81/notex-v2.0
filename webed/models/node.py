__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.sql.expression import ColumnClause, ColumnElement
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.dialects import postgres as pg
from sqlalchemy.ext.compiler import compiles
from sqlalchemy import inspect

from uuid import uuid4 as uuid_random

from ..ext.db import db
from ..ext.cache import cache

import os.path

###############################################################################
###############################################################################

class NodeUuidPathColumn (ColumnElement):
    def __init__(self, entity):
        insp = inspect (entity)
        self.entity = insp.selectable

@compiles (NodeUuidPathColumn)
def compile_node_uuid_path_column (element, compiler, **kwargs):
    return "%s.uuid_path" % compiler.process (element.entity, ashint=True)

class NodeNamePathColumn (ColumnElement):
    def __init__(self, entity):
        insp = inspect (entity)
        self.entity = insp.selectable

@compiles (NodeNamePathColumn)
def compile_node_name_path_column (element, compiler, **kwargs):
    return "%s.name_path" % compiler.process (element.entity, ashint=True)

###############################################################################
###############################################################################

class Node (db.Model):
    __mapper_args__ = {'polymorphic_identity':'node', 'polymorphic_on':'type'}

    id = db.Column (db.Integer, db.Sequence ('node_id_seq'), primary_key=True)
    type = db.Column ('type', db.String (16), nullable=False, index=True)

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
    _mime = db.Column (db.String (), nullable=False, index=True,
        name = 'mime')
    _name = db.Column (db.Unicode (), nullable=False, index=True,
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

    @hybrid_property
    def uuid_path (self):
        return os.path.sep.join (self.get_path (field='uuid'))
    @uuid_path.expression
    def uuid_path (cls):
        return NodeUuidPathColumn (cls)

    @hybrid_property
    def name_path (self):
        return os.path.sep.join (self.get_path (field='name'))
    @name_path.expression
    def name_path (cls):
        return NodeNamePathColumn (cls)

    ###########################################################################

    def get_size (self, **kwargs):

        @cache.version (key=[self.uuid, 'size'] + kwargs.values ())
        def cached_size (node, **kwargs):

            props = node.props.filter_by (**kwargs).all ()
            value = reduce (lambda s,p: s+p.size, props, 0)
            value+= reduce (lambda s,n: s+n.get_size (**kwargs), node.nodes, 0)
            return value

        return cached_size (self, **kwargs)

    @hybrid_property
    def size (self):
        return self.get_size (name='data')

###############################################################################
###############################################################################

class NodeExUuidPathColumn (ColumnClause):
    pass

@compiles (NodeExUuidPathColumn)
def compile_node_ex_uuid_path_column (element, compiler, **kwargs):
    return "node_ex.uuid_path" ## TODO: % compiler.process (..)!?

class NodeExNamePathColumn (ColumnClause):
    pass

@compiles (NodeExNamePathColumn)
def compile_node_ex_name_path_column (element, compiler, **kwargs):
    return "node_ex.name_path" ## TODO: % compiler.process (..)!?

###############################################################################
###############################################################################

class NodeEx (Node):
    __tablename__ = 'node_ex'
    __mapper_args__ = {'polymorphic_identity': 'node-ex'}

    node_id = db.Column (db.Integer, db.ForeignKey ('node.id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (NodeEx, self).__init__ (name, root, mime=mime, uuid=uuid)

    def __repr__ (self):

        return u'<NodeEx@%x: %s>' % (self.id if self.id else 0, self._name)

    @hybrid_property
    def uuid_path (self):
        return os.path.sep.join (self.get_path (field='uuid'))
    @uuid_path.expression
    def uuid_path (cls):
        return NodeExUuidPathColumn (cls)

    @hybrid_property
    def name_path (self):
        return os.path.sep.join (self.get_path (field='name'))
    @name_path.expression
    def name_path (cls):
        return NodeExNamePathColumn (cls)

###############################################################################
###############################################################################
