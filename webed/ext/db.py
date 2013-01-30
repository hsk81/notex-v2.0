__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.sqlalchemy import SQLAlchemy
from ..app import app

import os.path

###############################################################################
###############################################################################

db = SQLAlchemy (app)
db.Query.back = db.Query.reset_joinpoint

def db_session__script (path):

    if isinstance (path, list):
        path = os.path.sep.join (path)
    with open (path) as file:
        sql = file.read ()

    db.session.execute (sql)

db.session.script = db_session__script

def db_session__wrap (fn):
    def decorator (*args, **kwargs):
        try:
            result = fn (*args, **kwargs)
            db.session.commit()
            return result
        except:
            db.session.rollback()
            raise
    return decorator

db.session.wrap = db_session__wrap

def db_session__nest (fn):
    def decorator (*args, **kwargs):
        db.session.begin (nested=True)
        try:
            result = fn (*args, **kwargs)
            db.session.commit()
            return result
        except:
            db.session.rollback()
            raise
    return decorator

db.session.nest = db_session__nest

###############################################################################
###############################################################################
