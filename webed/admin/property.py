__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user

from webed.ext import admin, db, login
from webed.models import Property

###############################################################################
###############################################################################

class PropertyAdmin (ModelView):

    column_list = ('base', 'node', 'name', 'mime', 'uuid', 'type', 'size')
    column_sortable_list = ('name', 'mime', 'uuid', 'type')
    column_searchable_list = ('name', 'mime', 'type')
    column_filters = ('name', 'mime', 'type')
    form_columns = ('node', 'name', 'mime')

    def __init__ (self, session):
        super (PropertyAdmin, self).__init__ (Property, session)

    @login.privileged
    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (PropertyAdmin (db.session))

###############################################################################
###############################################################################
