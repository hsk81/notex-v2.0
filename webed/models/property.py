__author__ = 'hsk81'

###############################################################################
###############################################################################

from diff_match_patch import diff_match_patch as DMP

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.dialects import postgres as pg
from sqlalchemy import event

from uuid import uuid4 as uuid_random
from node import Node

from ..app import app
from ..ext.db import db
from ..ext.cache import dbs_cache

from .polymorphic import Polymorphic

import os
import acidfs
import base64
import transaction

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

    node = db.orm.relationship (Node, backref=db.orm.backref ('props',
        cascade='all, delete-orphan', lazy='dynamic'), foreign_keys=[node_id])
    base = db.orm.relationship (Node, backref=db.orm.backref ('subprops',
        cascade='all, delete-orphan', lazy='dynamic'), foreign_keys=[base_id])

    ###########################################################################

    _uuid = db.Column (pg.UUID, nullable=False, index=True, unique=True,
        name='uuid')
    _mime = db.Column (db.String (), nullable=False, index=False,
        name='mime')
    _name = db.Column (db.String (), nullable=False, index=False,
        name='name')

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

    def __init__ (self, name, node, mime=None, uuid=None):

        self.base = node.base if node and node.base else node
        self.node = node

        self._uuid = uuid if uuid else str (uuid_random ())
        self._mime = mime if mime else 'application/property'
        self._name = name

    def __repr__ (self):

        return u'<Property@%x: %s>' % (self.id if self.id else 0, self._name)

###############################################################################
###############################################################################

class DataPropertyMixin (object):

    _data = db.Column (db.String, name='data')
    _size = db.Column (db.Integer, nullable=False, default=0)

    @hybrid_property
    def data (self):
        return self.get_data ()
    @data.setter
    def data (self, value):
        self.set_data (value)

    def get_data (self):
        return self._data
    def set_data (self, value):
        self._data = value
        self._size = len (value) if value else 0

    @hybrid_property
    def size (self):
        return self._size

###############################################################################
###############################################################################

class StringProperty (Property, DataPropertyMixin):

    string_property_id = db.Column (db.Integer,
        db.Sequence ('string_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    ###########################################################################

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (StringProperty, self).__init__ (name, node, mime=mime
            if mime else 'text/plain', uuid=uuid)

        self.set_data (data)

    def __repr__ (self):

        return u'<StringProperty@%x: %s>' % (self.id if self.id
            else 0, self._name)

###############################################################################
###############################################################################

class ExternalProperty (Property, DataPropertyMixin):

    external_property_id = db.Column (db.Integer,
        db.Sequence ('external_property_id_seq'),
        db.ForeignKey ('property.id', ondelete='CASCADE'),
        primary_key=True)

    ###########################################################################

    @property
    def fs (self):
        if not hasattr (self, '_fs'):
            self._fs = None

        if self._fs is None:
            uuids = self.node.get_path (field='uuid')
            assert len (uuids) > 0

            path = os.path.join (app.config['FS_ACID'],
                uuids[1] if len (uuids) > 1 else uuids[0])
            self._fs = acidfs.AcidFS (path, bare=True)

        assert self._fs is not None
        return self._fs

    @staticmethod
    def fix_path (path):
        return path.replace (' ', '_') ## INFO: required due to an AcidFS bug!

    ###########################################################################

    def get_data (self):

        path_to = self.fix_path (self.node.name_path)
        assert self.fs.exists (path_to)

        with self.fs.open (path_to, mode='rb') as source:
            return self.decode (source.read ())

    def set_data (self, value, skip_patch=False):

        value = value if skip_patch else self.patch (value)
        value_key = unicode (dbs_cache.make_key (value))
        if self._data == value_key: return

        for uuid in self.node.get_path ('uuid'):
            dbs_cache.increase_version (key=[uuid, 'size', 'data'])

        self._data = value_key
        self._size = len (value) if value else 0

        path_to, name = os.path.split (self.node.name_path)
        path_to = self.fix_path (path_to)
        self.fs.mkdirs (path_to)

        with self.fs.cd (path_to):
            with self.fs.open (name, mode='wb') as target:
                target.write (self.encode (value))

        transaction.commit ()

    def decode (self, value): return value
    def encode (self, value): return value
    def patch (self, value): return value

    ###########################################################################

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (ExternalProperty, self).__init__ (name, node, mime=mime
            if mime else 'application/octet-stream', uuid=uuid)

        self.set_data (data)

    def __repr__ (self):

        return u'<ExternalProperty@%x: %s>' % (self.id if self.id else 0,
            self._name)

    ###########################################################################

    @staticmethod
    def on_path_update (target, src_path, dst_path, initiator):

        src_path = target.fix_path (src_path)
        dst_path = target.fix_path (dst_path)

        if target.fs.exists (src_path):
            target.fs.mv (src_path, dst_path)
            transaction.commit ()

    @staticmethod
    def on_delete (mapper, connection, target):

        for uuid in target.node.get_path ('uuid'):
            dbs_cache.increase_version (key=[uuid, 'size', 'data'])

        path_to = target.node.name_path
        path_to = target.fix_path (path_to)

        if target.fs.exists (path_to):
            target.fs.rm (path_to)
            transaction.commit ()

    @classmethod
    def register (cls):
        event.listen (cls, 'after_delete', cls.on_delete, propagate=True)

###############################################################################

ExternalProperty.register () ## events

###############################################################################
###############################################################################

class Base64Property (ExternalProperty):
    __tablename__ = None

    def encode (self, value):

        if value:
            return 'data:%s;base64,%s' % (
                self._mime, base64.encodestring (value))

    def decode (self, value):

        return value ## keep b64 encoding!

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (Base64Property, self).__init__ (name, data, node, mime=mime
            if mime else 'application/octet-stream', uuid=uuid)

    def __repr__ (self):

        return u'<Base64Property@%x: %s>' % (self.id if self.id else 0,
            self._name)

class TextProperty (ExternalProperty):
    __tablename__ = None

    def encode (self, value):

        try:
            return value.encode ('utf-8')
        except ValueError:
            return value

    def decode (self, value):

        try:
            return value.decode ('utf-8')
        except ValueError:
            return value

    def patch (self, value):

        if self._data:
            patches = self.dmp.patch_fromText (value)
            value, results = self.dmp.patch_apply (patches, self.get_data ())
            assert all (results)

        return value

    def __init__ (self, name, data, node, mime=None, uuid=None):

        super (TextProperty, self).__init__ (name, data, node, mime=mime
            if mime else 'text/plain', uuid=uuid)

    def __repr__ (self):

        return u'<TextProperty@%x: %s>' % (self.id if self.id else 0,
            self._name)

    @property
    def dmp (self):

        if not hasattr (self, '_dmp') or not self._dmp:
            self._dmp = DMP ()

        return self._dmp

###############################################################################
###############################################################################
