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
        assert sql

    db.session.execute (sql)

db.session.script = db_session__script

###############################################################################
###############################################################################
