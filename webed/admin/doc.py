__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.login import current_user

from webed.ext import db, admin
from webed.models import Doc

###############################################################################
###############################################################################

class DocAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name')
    searchable_columns = (Doc.uuid, Doc.mime, Doc.name)
    column_filters = (Doc.uuid, Doc.mime, Doc.name)

    def __init__ (self, session):
        super (DocAdmin, self).__init__ (Doc, session)

    def is_accessible(self):
        return current_user.is_authenticated ()

admin.add_view (DocAdmin (db.session))

###############################################################################
###############################################################################
