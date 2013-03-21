__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.login import current_user, login_user, logout_user
from flask.ext.admin import Admin, AdminIndexView, expose
from flask import redirect

from ..app import app
from ..ext import login
from ..models import User
from ..util.linq import Q

###############################################################################
###############################################################################

class IndexView (AdminIndexView):

    @expose ('/')
    @login.privileged
    def index (self):

        if current_user.is_anonymous ():
            current_user.name = u'anonymous'

        return self.render ('admin.html', debug=app.debug, user=current_user)

    @expose ('/login', methods=['GET'])
    def login (self):

        if login.is_privileged ():
            user = Q (User.query).one_or_default (mail=u'admin@mail.net')
            if user: login_user (user)

        return redirect ('/admin/')

    @expose ('/logout')
    def logout (self):

        logout_user ()
        return redirect ('/admin/')

###############################################################################
###############################################################################

admin = Admin (app, name='WebEd', index_view=IndexView (name='Admin'))

###############################################################################
###############################################################################
