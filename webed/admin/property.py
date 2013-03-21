__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user
from flask import request

from webed.app import app
from webed.ext import db, admin
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

    def is_accessible(self):
        if request.remote_addr in app.config['PRIVILEGED_ADDRESSES']:
            return current_user.is_authenticated ()

        return False

admin.add_view (PropertyAdmin (db.session))

###############################################################################
###############################################################################
