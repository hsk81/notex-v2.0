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

    column_list = ('base', 'root', 'type', 'uuid', 'mime', 'name')
    column_searchable_list = (Node.uuid, Node.mime, Node.name, Node.type)
    column_filters = (Node.uuid, Node.mime, Node.name, Node.type)
    form_columns = ('root', 'mime', 'name')

    def __init__ (self, session):
        super (NodeAdmin, self).__init__ (Node, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (NodeAdmin (db.session))

###############################################################################
###############################################################################
