__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqla import ModelView
from flask.ext.login import current_user

from webed.ext import admin, db, login
from webed.models import Leaf

###############################################################################
###############################################################################

class LeafAdmin (ModelView):

    column_list = ('base', 'root', 'name', 'mime', 'uuid', 'type', 'size')
    column_sortable_list = ('name', 'mime', 'uuid', 'type')
    column_searchable_list = ('name', 'mime', 'type')
    column_filters = ('name', 'mime', 'type')
    form_columns = ('root', 'name', 'mime')

    def __init__ (self, session):
        super (LeafAdmin, self).__init__ (Leaf, session)

    @login.privileged
    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (LeafAdmin (db.session))

###############################################################################
###############################################################################
