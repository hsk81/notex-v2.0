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

    column_list = ('base', 'root', 'name', 'mime', 'uuid', 'type', 'size')
    column_searchable_list = (Leaf.mime, Leaf.name, Leaf.type)
    column_filters = (Leaf.mime, Leaf.name, Leaf.type)
    form_columns = ('root', 'mime', 'name')

    def __init__ (self, session):
        super (LeafAdmin, self).__init__ (Leaf, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (LeafAdmin (db.session))

###############################################################################
###############################################################################
