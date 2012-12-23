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

    columns_list = ('base', 'root', 'uuid', 'mime', 'name')
    column_searchable_list = (Leaf.uuid, Leaf.mime, Leaf.name)
    column_filters = (Leaf.uuid, Leaf.mime, Leaf.name)

    def __init__ (self, session):
        super (LeafAdmin, self).__init__ (Leaf, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (LeafAdmin (db.session))

###############################################################################
###############################################################################
