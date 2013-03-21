__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.fileadmin import FileAdmin
from flask.ext.login import current_user

from webed.ext import admin
from webed.ext import login

import os.path

###############################################################################
###############################################################################

class AuthFileAdmin (FileAdmin):

    @login.privileged
    def is_accessible(self):
        return current_user.is_authenticated ()

path = os.path.join (os.path.dirname (__file__), '..', 'static')
admin.add_view (AuthFileAdmin (path, '/static/', name='Files'))

###############################################################################
###############################################################################
