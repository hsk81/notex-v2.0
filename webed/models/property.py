__author__ = 'hsk81'

###############################################################################
###############################################################################

from uuid import uuid4 as uuid_random
from node import Node
from ..ext import db

###############################################################################
###############################################################################

class Property (db.Model):
    __mapper_args__ = {
        'polymorphic_identity':'Property', 'polymorphic_on':'type'
    }

    id = db.Column (db.Integer, db.Sequence ('property_id_seq'),
        primary_key=True)
    type = db.Column ('type', db.String (24))

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

    uuid = db.Column (db.String (36), nullable=False, index=True, unique=True)
    mime = db.Column (db.String (256), nullable=False, index=True)
    name = db.Column (db.String (256), nullable=False, index=True)

    def __init__ (self, name, node, mime=None, uuid=None):

        self.base = node.base if node and node.base else node
        self.node = node

        self.uuid = uuid if uuid else str (uuid_random ())
        self.mime = mime if mime else 'application/property'
        self.name = name

    def __repr__ (self):

        return u'<Property@%x: %s>' % (self.id, self.name)

###############################################################################
###############################################################################

def get_node_size (node, **kwargs):
    """
    TODO: Use caching with invalidation on a corresponding change in sub-tree!
    """
    props = node.props.filter_by (**kwargs).all ()
    value = reduce (lambda acc, p: acc + p.size, props, 0)
    value+= reduce (lambda acc, n: acc + n.get_size (**kwargs), node.nodes, 0)

    return value

Node.get_size = get_node_size

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.String
###############################################################################

class StringProperty (Property):
    __mapper_args__ = {'polymorphic_identity': 'StringProperty'}

    text_property_id = db.Column (db.Integer,
        db.Sequence ('string_property_id_seq'),
        db.ForeignKey ('property.id'),
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

    size = property (get_size)
    data = db.Column (db.String)

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.Text
###############################################################################

class TextProperty (Property):
    __mapper_args__ = {'polymorphic_identity': 'TextProperty'}

    text_property_id = db.Column (db.Integer,
        db.Sequence ('text_property_id_seq'),
        db.ForeignKey ('property.id'),
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

    size = property (get_size)
    data = db.Column (db.Text)

###############################################################################
# http://docs.sqlalchemy.org/../types.html#sqlalchemy.types.LargeBinary
###############################################################################

class LargeBinaryProperty (Property):
    __mapper_args__ = {'polymorphic_identity': 'LargeBinaryProperty'}

    large_binary_property_id = db.Column (db.Integer,
        db.Sequence ('large_binary_property_id_seq'),
        db.ForeignKey ('property.id'),
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

    size = property (get_size)
    data = db.Column (db.LargeBinary)

###############################################################################
###############################################################################
