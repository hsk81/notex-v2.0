__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user

from webed.ext import db, admin
from webed.models import Node

###############################################################################
###############################################################################

class NodeAdmin (ModelView):

    column_list = ('base', 'root', 'name', 'mime', 'uuid', 'type', 'size')
    column_sortable_list = ('name', 'mime', 'uuid', 'type')
    column_searchable_list = ('name', 'mime', 'type')
    column_filters = ('name', 'mime', 'type')
    form_columns = ('root', 'name', 'mime')

    def __init__ (self, session):
        super (NodeAdmin, self).__init__ (Node, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (NodeAdmin (db.session))

###############################################################################
###############################################################################
