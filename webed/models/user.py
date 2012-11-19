__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.login import UserMixin
from uuid import uuid4 as uuid_random
from ..ext import db

###############################################################################
###############################################################################

class User (db.Model, UserMixin):

    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    name = db.Column (db.Unicode (256))
    mail = db.Column (db.Unicode (256), unique=True)

    def __init__ (self, name, mail, uuid=None):

        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.mail = unicode (mail)

    def __repr__ (self):

        return u'<User %r>' % self.mail

###############################################################################
###############################################################################
