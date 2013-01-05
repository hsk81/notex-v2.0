__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user

from webed.ext import db, admin
from webed.models import Property

###############################################################################
###############################################################################

class PropertyAdmin (ModelView):

    column_list = ('base', 'node', 'name', 'mime', 'uuid', 'type', 'size')
    column_searchable_list = (
        Property.uuid, Property.mime, Property.name, Property.type)
    column_filters = (
        Property.uuid, Property.mime, Property.name, Property.type)
    form_columns = ('node', 'mime', 'name')

    def __init__ (self, session):
        super (PropertyAdmin, self).__init__ (Property, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (PropertyAdmin (db.session))

###############################################################################
###############################################################################
