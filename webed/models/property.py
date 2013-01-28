__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.dialects import postgres as pg

from uuid import uuid4 as uuid_random
from node import Node

from ..ext.db import db
from ..ext.cache import cache

###############################################################################
###############################################################################

class Property (db.Model):
    __mapper_args__ = {
        'polymorphic_identity':'Property', 'polymorphic_on':'type'
    }

    id = db.Column (db.Integer, db.Sequence ('property_id_seq'),
        index=True, primary_key=True)
    type = db.Column ('type', db.String (16), nullable=False,
        index=False)

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
        return self._data

    @data.setter
    def data (self, value):

        for uuid in self.node.get_path ('uuid'):
            cache.increase_version (key=[uuid, 'size', 'data'])

        cache.increase_version (key=[self.uuid, 'size', 'data'])
        self._data = value

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

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.String
###############################################################################

class StringProperty (Property):
    __mapper_args__ = {'polymorphic_identity': 'StringProperty'}

    text_property_id = db.Column (db.Integer,
        db.Sequence ('string_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (StringProperty, self).__init__ (name, node,
            mime=mime if mime else 'text/plain', uuid=uuid)

        self.data = data

    def __repr__ (self):

        return u'<StringProperty@%r: %r>' % (self.id if self.id \
            else 0, self._name)

    def get_size (self):

        @cache.version (key=[self.uuid, 'size', 'data'])
        def cached_size (self):
            return len (self._data.encode ('utf-8')) \
                if self._data  is not None else 0

        return cached_size (self)

    _data = db.Column (db.String, name='data')
    _size = property (get_size)

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.Text
###############################################################################

class TextProperty (Property):
    __mapper_args__ = {'polymorphic_identity': 'TextProperty'}

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

class LargeBinaryProperty (Property):
    __mapper_args__ = {'polymorphic_identity': 'LargeBinaryProperty'}

    large_binary_property_id = db.Column (db.Integer,
        db.Sequence ('large_binary_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (LargeBinaryProperty, self).__init__ (name, node, mime=mime \
            if mime else 'application/octet-stream', uuid=uuid)

        self.data = data

    def __repr__ (self):

        return u'<LargeBinaryProperty@%x: %s>' % (self.id if self.id \
            else 0, self._name)

    def get_size (self):

        @cache.version (key=[self.uuid, 'size', 'data'])
        def cached_size (self):
            return len (self._data) if self._data is not None else 0

        return cached_size (self)

    _data = db.Column (db.LargeBinary, name='data')
    _size = property (get_size)

###############################################################################
###############################################################################
