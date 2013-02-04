__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.dialects import postgres as pg
from sqlalchemy import event

from uuid import uuid4 as uuid_random
from node import Node

from ..ext.db import db
from ..ext.cache import cache, object_cache
from .polymorphic import Polymorphic

import base64

###############################################################################
###############################################################################

class Property (db.Model, Polymorphic):

    id = db.Column (db.Integer, db.Sequence ('property_id_seq'),
        index=True, primary_key=True)

    ###########################################################################

    node_id = db.Column (db.Integer,
        db.ForeignKey (Node.id,ondelete='CASCADE'), index=True, nullable=False)
    base_id = db.Column (db.Integer,
        db.ForeignKey (Node.id,ondelete='CASCADE'), index=True, nullable=False)

    node = db.relationship (Node, backref=db.backref ('props',
        cascade='all, delete-orphan', lazy='dynamic'),
        primaryjoin='Node.id==Property.node_id')

    base = db.relationship (Node, backref=db.backref ('subprops',
        cascade='all, delete-orphan', lazy='dynamic'),
        primaryjoin='Node.id==Property.base_id')

    ###########################################################################

    _uuid = db.Column (pg.UUID, nullable=False, index=True, unique=True,
        name = 'uuid')
    _mime = db.Column (db.String (), nullable=False, index=False,
        name = 'mime')
    _name = db.Column (db.String (), nullable=False, index=False,
        name = 'name')

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

    @hybrid_property
    def data (self):
        return self.get_data ()
    @data.setter
    def data (self, value):
        self.set_data (value)

    @hybrid_property
    def size (self):
        return self._size

    ###########################################################################

    def __init__ (self, name, node, mime=None, uuid=None):

        self.base = node.base if node and node.base else node
        self.node = node

        self._uuid = uuid if uuid else str (uuid_random ())
        self._mime = mime if mime else 'application/property'
        self._name = name

    def __repr__ (self):

        return u'<Property@%x: %s>' % (self.id if self.id else 0, self._name)

    def set_data (self, value):

        self._data = value

        for uuid in self.node.get_path ('uuid'):
            cache.increase_version (key=[uuid, 'size', 'data'])
        cache.increase_version (key=[self.uuid, 'size', 'data'])

    def get_data (self):

        return self._data

    @staticmethod
    def on_delete (mapper, connection, target):

        for uuid in target.node.get_path ('uuid'):
            cache.increase_version (key=[uuid, 'size', 'data'])

    @classmethod
    def register (cls):
        event.listen (cls, 'after_delete', cls.on_delete, propagate=True)

###############################################################################

Property.register () ## events

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.String
###############################################################################

class StringProperty (Property):

    text_property_id = db.Column (db.Integer,
        db.Sequence ('string_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (StringProperty, self).__init__ (name, node,
            mime=mime if mime else 'text/plain', uuid=uuid)

        self.data = data

    def __repr__ (self):

        return u'<StringProperty@%x: %s>' % (self.id if self.id \
            else 0, self._name)

    def get_size (self):

        @cache.version (key=[self.uuid, 'size', 'data'])
        def cached_size (self):
            return len (self._data.encode ('utf-8')) \
                if self._data is not None else 0

        return cached_size (self)

    _data = db.Column (db.String, name='data')
    _size = property (get_size)

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.Text
###############################################################################

class TextProperty (Property):

    text_property_id = db.Column (db.Integer,
        db.Sequence ('text_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (TextProperty, self).__init__ (name, node, mime=mime \
            if mime else 'text/plain', uuid=uuid)

        self.data = data

    def __repr__ (self):

        return u'<TextProperty@%x: %s>' % (self.id if self.id \
            else 0, self._name)

    def get_size (self):

        @cache.version (key=[self.uuid, 'size', 'data'])
        def cached_size (self):
            return len (self._data.encode ('utf-8')) \
                if self._data is not None else 0

        return cached_size (self)

    _data = db.Column (db.String, name='data')
    _size = property (get_size)

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.LargeBinary
###############################################################################

class BinaryProperty (Property):

    large_binary_property_id = db.Column (db.Integer,
        db.Sequence ('binary_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (BinaryProperty, self).__init__ (name, node, mime=mime \
            if mime else 'application/octet-stream', uuid=uuid)

        self.data = data

    def __repr__ (self):

        return u'<BinaryProperty@%x: %s>' % (self.id if self.id else 0,
            self._name)

    def set_data (self, value):

        value_key = unicode (object_cache.make_key (value))
        if self._data == value_key: return

        super (BinaryProperty, self).set_data (value_key)
        self._size = len (value)

        if not object_cache.exists (value_key):
            object_cache.set (value_key, 'data:%s;base64,%s' % (self._mime,
                base64.encodestring (value)), object_cache.NEVER)

        version_key = object_cache.make_key (value_key)
        version = object_cache.increase (version_key)
        assert version > 0

    def get_data (self):

        return object_cache.get (key=self._data)

    _data = db.Column (db.String, name='data')
    _size = db.Column (db.Integer, nullable=False, default=0)

    @staticmethod
    def on_delete (mapper, connection, target):

        version_key = object_cache.make_key (target._data)
        version = object_cache.decrease (key=version_key)
        if version == 0: object_cache.delete (key=target._data)

    @classmethod
    def register (cls):
        event.listen (cls, 'after_delete', cls.on_delete)

###############################################################################

BinaryProperty.register () ## events

###############################################################################
###############################################################################
