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

db = WebedOrm (app)
db.Query.back = db.Query.reset_joinpoint

def db_session__script (path):

    if isinstance (path, list):
        path = os.path.sep.join (path)
    with open (path) as file:
        sql = file.read ()

    db.session.execute (sql)

db.session.script = db_session__script

###############################################################################
###############################################################################
