__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.sqlalchemy import SQLAlchemy
from ..app import app

import os.path
import functools

###############################################################################
###############################################################################

class WebedOrm (SQLAlchemy):

    def __init__ (self, *args, **kwargs):

        super (WebedOrm, self).__init__ (*args, **kwargs)

        self.session.script = self.script
        self.session.wrap = self.wrap
        self.session.nest = self.nest

        self.Query.back = self.Query.reset_joinpoint

    def script (self, path):

        if isinstance (path, list):
            path = os.path.sep.join (path)
        with open (path) as file:
            sql = file.read ()

        db.session.execute (sql)

    def wrap (self, unless=None, lest=None):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)
                if callable (lest) and lest (*args, **kwargs) is True:
                    return fn (*args, **kwargs)

                try:
                    result = fn (*args, **kwargs)
                    db.session.commit()
                    return result
                except:
                    db.session.rollback()
                    raise

            return decorated
        return decorator

    def nest (self, unless=None, lest=None):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)
                if callable (lest) and lest (*args, **kwargs) is True:
                    return fn (*args, **kwargs)

                db.session.begin (nested=True)

                try:
                    result = fn (*args, **kwargs)
                    db.session.commit()
                    return result
                except:
                    db.session.rollback()
                    raise

            return decorated
        return decorator

###############################################################################
###############################################################################

db = WebedOrm (app)

###############################################################################
###############################################################################
