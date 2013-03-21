__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.admin.contrib.fileadmin import FileAdmin
from flask.ext.login import current_user, logout_user
from flask import request

from webed.ext import admin
from webed.app import app

import os.path

###############################################################################
###############################################################################

class AuthFileAdmin (FileAdmin):

    def is_accessible(self):
        if current_user.is_authenticated ():
            if request.remote_addr not in app.config['PRIVILEGED_ADDRESSES']:
                logout_user () ## authentication double check failed!

        return current_user.is_authenticated ()

path = os.path.join (os.path.dirname (__file__), '..', 'static')
admin.add_view (AuthFileAdmin (path, '/static/', name='Files'))

###############################################################################
###############################################################################
