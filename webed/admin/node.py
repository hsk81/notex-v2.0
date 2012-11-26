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

    list_columns = ('base', 'root', 'uuid', 'mime', 'name')
    searchable_columns = (Node.uuid, Node.mime, Node.name)
    column_filters = (Node.uuid, Node.mime, Node.name)

    def __init__ (self, session):
        super (NodeAdmin, self).__init__ (Node, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (NodeAdmin (db.session))

###############################################################################
###############################################################################
