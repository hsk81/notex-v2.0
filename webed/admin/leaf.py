__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user, logout_user
from flask import request

from webed.app import app
from webed.models import Leaf
from webed.ext import db, admin

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

    def is_accessible(self):
        if current_user.is_authenticated ():
            if request.remote_addr not in app.config['PRIVILEGED_ADDRESSES']:
                logout_user () ## authentication double check failed!

        return current_user.is_authenticated ()

admin.add_view (LeafAdmin (db.session))

###############################################################################
###############################################################################
