__author__ = 'hsk81'

###############################################################################
###############################################################################

from uuid import uuid4 as uuid_random
from ..ext import db

###############################################################################
###############################################################################

class Doc (db.Model):

    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    mime = db.Column (db.String (256))
    name = db.Column (db.Unicode (256))

    ##
    ## Set.subdocs = Q (Doc.query).all (base=set) for a set, which means that
    ## for any *non-base* "set": Q (set.subdocs).all () = [].
    ##

    base_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    base = db.relationship ('Set', primaryjoin="Doc.base_id==Set.id",
        backref=db.backref ('subdocs', lazy='dynamic', cascade='all'))

    ##
    ## Set.docs = Q (Doc.query).all (root=set) for a set, which means only the
    ## *immediate* docs for a given set.
    ##

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    root = db.relationship ('Set', primaryjoin="Doc.root_id==Set.id",
        backref=db.backref ('docs', lazy='dynamic', cascade='all'))

    def __init__ (self, name, root, uuid=None, mime=None):

        self.base = root.base if root and root.base else root
        self.mime = mime if mime else 'application/doc'
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.root = root

    def __repr__ (self):

        return u'<Doc %r>' % self.name

###############################################################################
###############################################################################
