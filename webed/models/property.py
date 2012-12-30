__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.ext.hybrid import hybrid_property
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
        primary_key=True)
    type = db.Column ('type', db.String (24))

    ###########################################################################

    node_id = db.Column (db.Integer,
        db.ForeignKey (Node.id, ondelete='CASCADE'), index=True, nullable=False)
    base_id = db.Column (db.Integer,
        db.ForeignKey (Node.id, ondelete='CASCADE'), index=True, nullable=False)

    node = db.relationship (Node, backref=db.backref ('props',
        cascade='all, delete-orphan', lazy='dynamic'),
        primaryjoin='Node.id==Property.node_id')

    base = db.relationship (Node, backref=db.backref ('subprops',
        cascade='all, delete-orphan', lazy='dynamic'),
        primaryjoin='Node.id==Property.base_id')

    ###########################################################################

    _uuid = db.Column (db.String (36), nullable=False, index=True, unique=True,
        name = 'uuid')
    _mime = db.Column (db.String (256), nullable=False, index=True,
        name = 'mime')
    _name = db.Column (db.String (256), nullable=False, index=True,
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
            key = cache.make_key (uuid, 'rev', 'size', name='data')
            rev = cache.get (key) or 0; cache.set (key, rev+1)

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

        return u'<Property@%x: %s>' % (self.id, self.name)

###############################################################################
###############################################################################

def get_node_size (node, **kwargs):

    rev_key = cache.make_key (node.uuid, 'rev', 'size', **kwargs)
    rev = cache.get (rev_key) or 0
    val_key = cache.make_key (node.uuid, 'size', rev, **kwargs)
    val = cache.get (val_key)

    if not val:
        props = node.props.filter_by (**kwargs).all ()
        val = reduce (lambda acc, p: acc+p.size, props, 0)
        val+= reduce (lambda acc, n: acc+n.get_size (**kwargs), node.nodes, 0)

        cache.set (rev_key, rev)
        cache.set (val_key, val)

    return val

Node.get_size = get_node_size

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

        return u'<StringProperty@%r: %r>' % (self.id, self.name)

    def get_size (self):
        """
        TODO: Use caching in combination with a SQLAlchemy read-only property!
        """
        return len (self.data.encode ('utf-8')) if self.data else None

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

        return u'<TextProperty@%r: %r>' % (self.id, self.name)

    def get_size (self):
        """
        TODO: Use caching in combination with a SQLAlchemy read-only property!
        """
        return len (self.data.encode ('utf-8')) if self.data else None

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

        return u'<LargeBinaryProperty@%r: %r>' % (self.id, self.name)

    def get_size (self):
        """
        TODO: Use caching in combination with a SQLAlchemy read-only property!
        """
        return len (self.data) if self.data else None

    _data = db.Column (db.LargeBinary, name='data')
    _size = property (get_size)

###############################################################################
###############################################################################
