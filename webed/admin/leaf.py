__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user

from webed.ext import db, admin
from webed.models import Leaf

###############################################################################
###############################################################################

class LeafAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name')
    searchable_columns = (Leaf.uuid, Leaf.mime, Leaf.name)
    column_filters = (Leaf.uuid, Leaf.mime, Leaf.name)

    def __init__ (self, session):
        super (LeafAdmin, self).__init__ (Leaf, session)

        ##
        ## TODO: Removed following two lines with the next release of Flask -
        ##       Admin; see http://github.com/mrjoes/flask-admin/issues/121.
        ##

        self._search_joins = {} # temporary measure
        self._filter_joins = {} # temporary measure

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (LeafAdmin (db.session))

###############################################################################
###############################################################################
