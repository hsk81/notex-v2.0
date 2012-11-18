#!bin/python

###############################################################################
###############################################################################

from webed.app import app
from webed.ext import db

from flask.ext.script import Manager

###############################################################################
###############################################################################

manager = Manager (app)

###############################################################################
###############################################################################

@manager.command
def run (debug=False, config=None):
    """Runs the Flask server i.e. app.run (debug=True|False)"""

    if config:
        app.config.from_pyfile (config, silent=False)

    app.run (debug=debug)

@manager.command
def init ():
    """Init database tables"""
    db.create_all ()

@manager.command
def drop ():
    """Drops database tables"""
    db.drop_all ()

@manager.command
def execute (source):
    """Execute source in application context"""
    with app.app_context(): exec source

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
