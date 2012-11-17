__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.sqlamodel import ModelView

from webed.ext import db, admin
from webed.models import Doc

###############################################################################
###############################################################################

class DocAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name', 'ext')
    searchable_columns = (Doc.uuid, Doc.mime, Doc.name, Doc.ext)
    column_filters = (Doc.uuid, Doc.mime, Doc.name, Doc.ext)

    def __init__ (self, session):
        super (DocAdmin, self).__init__ (Doc, session)

admin.add_view (DocAdmin (db.session))

###############################################################################
###############################################################################
