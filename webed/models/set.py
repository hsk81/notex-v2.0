__author__ = 'hsk81'

###############################################################################
###############################################################################

from uuid import uuid4 as uuid_random
from webed.ext import db

###############################################################################
###############################################################################

class Set (db.Model):

    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    mime = db.Column (db.String (256))
    name = db.Column (db.Unicode (256))

    ##
    ## Set.subsets = Q (Set.query).all (base=set) for a set, which means that
    ## for any *non-base* "set": Q (set.subsets).all () = [].
    ##

    base_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    subsets = db.relationship ('Set',
        cascade='all', lazy='dynamic',
        primaryjoin="Set.base_id==Set.id",
        backref=db.backref ('base', remote_side='Set.id'))

    ##
    ## Set.sets = Q (Set.query).all (root=set) for a set, which means only the
    ## *immediate* sets for a given set.
    ##

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    sets = db.relationship ('Set',
        cascade='all', lazy='dynamic',
        primaryjoin="Set.root_id==Set.id",
        backref=db.backref ('root', remote_side='Set.id'))

    def __init__ (self, name, root, uuid=None, mime=None):

        self.base = root.base if root and root.base else root
        self.uuid = uuid if uuid else str (uuid_random ())
        self.mime = mime if mime else 'application/set'
        self.name = unicode (name)
        self.root = root

    def __repr__ (self):

        return '<Set %r>' % self.name

###############################################################################
###############################################################################
