__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.fileadmin import FileAdmin
from flask.ext.admin.contrib.sqlamodel import ModelView

from extensions import db, admin
from models import Set, Doc

import os.path

###############################################################################
###############################################################################

class SetAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name')
    searchable_columns = (Set.uuid, Set.mime, Set.name)
    column_filters = (Set.uuid, Set.mime, Set.name)

    def __init__ (self, session):
        super (SetAdmin, self).__init__(Set, session)

class DocAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name', 'ext')
    searchable_columns = (Doc.uuid, Doc.mime, Doc.name, Doc.ext)
    column_filters = (Doc.uuid, Doc.mime, Doc.name, Doc.ext)

    def __init__ (self, session):
        super (DocAdmin, self).__init__(Doc, session)

admin.add_view (SetAdmin (db.session))
admin.add_view (DocAdmin (db.session))

path = os.path.join (os.path.dirname (__file__), 'static')
admin.add_view (FileAdmin (path, '/static/', name='Files'))

###############################################################################
###############################################################################
