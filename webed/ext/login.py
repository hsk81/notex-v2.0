__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.login import LoginManager, current_user, logout_user
from flask import request

from ..app import app
from ..models.user import User

import functools

###############################################################################
###############################################################################

class WebedLoginManager (LoginManager):

    @staticmethod
    def privileged (fn):

        @functools.wraps (fn)
        def decorator (*args, **kwargs):

            if current_user.is_authenticated ():
                if not WebedLoginManager.is_privileged:
                    logout_user () ## double check failed!

            return fn (*args, **kwargs)
        return decorator

    @property
    def is_privileged (self):

        privileged_addresses = app.config['PRIVILEGED_ADDRESSES']
        assert privileged_addresses and len (privileged_addresses) > 0
        return request.remote_addr in privileged_addresses

###############################################################################

login = WebedLoginManager ()
login.init_app (app)

@login.user_loader
def load_user (identifier):
    return User.query.get (identifier)

###############################################################################
###############################################################################
