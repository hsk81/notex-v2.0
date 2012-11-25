__author__ = 'hsk81'

###############################################################################
###############################################################################

from node import Node
from ..ext import db

###############################################################################
###############################################################################

class Set (Node):
    __mapper_args__ = {'polymorphic_identity': 'set'}

    set_id = db.Column (db.Integer, db.ForeignKey ('node.id'),
        primary_key=True)

    def __init__ (self, name, root, mime=None, uuid=None):

        super (Set, self).__init__ (name, root, mime=mime if mime\
        else 'application/set', uuid=uuid)

    def __repr__ (self):

        if self.base:
            return u'<Set %r>' % self.name

        else:
            return u'<Set %r>' % u'%s..%s' % (self.uuid[:3], self.uuid[-3:])

    ##
    ## Set.subsets = Q (Set.query).all (base=set) for a set, which means that
    ## for any *non-base* "set": Q (set.subsets).all () = [].
    ##

    subsets = property (lambda self: self.tree.filter_by (type='set'))

    ##
    ## Set.sets = Q (Set.query).all (root=set) for a set, which means only the
    ## *immediate* sets for a given set.
    ##

    sets = property (lambda self: self.nodes.filter_by (type='set'))

    ##
    ## Set.subdocs = Q (Doc.query).all (base=set) for a set, which means that
    ## for any *non-base* "set": Q (set.subdocs).all () = [].
    ##

    subdocs = property (lambda self: self.tree.filter_by (type='doc'))

    ##
    ## Set.docs = Q (Doc.query).all (root=set) for a set, which means only the
    ## *immediate* docs for a given set.
    ##

    docs = property (lambda self: self.nodes.filter_by (type='doc'))

###############################################################################
###############################################################################
