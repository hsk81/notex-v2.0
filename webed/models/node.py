__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy.ext.hybrid import hybrid_property
from uuid import uuid4 as uuid_random

from ..ext.db import db
from ..ext.cache import cache

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

    _uuid = db.Column (db.String (36), nullable=False, index=True, unique=True,
        name = 'uuid')
    _mime = db.Column (db.String (256), nullable=False, index=True,
        name = 'mime')
    _name = db.Column (db.Unicode (256), nullable=False, index=True,
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

    ###########################################################################

    def __init__ (self, name, root, mime=None, uuid=None):

        self.base = root.base if root and root.base else root
        self.root = root

        self._uuid = uuid if uuid else str (uuid_random ())
        self._name = unicode (name) if name is not None else None
        self._mime = mime if mime else 'application/node'

    def __repr__ (self):

        return u'<Node@%x: %s>' % (self.id, self._name)

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

###############################################################################
###############################################################################
