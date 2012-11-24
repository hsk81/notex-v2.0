__author__ = 'hsk81'

###############################################################################
###############################################################################

from uuid import uuid4 as uuid_random
from ..ext import db

###############################################################################
###############################################################################

class Meta (db.Model):

    __tablename__ = 'meta'
    id = db.Column (db.Integer, primary_key=True)
    type = db.Column ('type', db.String (16))
    __mapper_args__ = {'polymorphic_identity': 'meta', 'polymorphic_on': type}

    uuid = db.Column (db.String (32), nullable=False, unique=True)
    mime = db.Column (db.String (256), nullable=True)
    name = db.Column (db.Unicode (256), nullable=True)

    def __init__ (self, name=None, mime=None, uuid=None):

        self.uuid = uuid.hex if uuid else str (uuid_random ().hex)
        self.name = unicode (name) if name else None
        self.mime = mime if mime else None

###############################################################################
###############################################################################
