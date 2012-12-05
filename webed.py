#!bin/python

###############################################################################
###############################################################################

from webed.app import app
from webed.ext import db
from webed.models import User

from flask.ext.script import Manager, Command, Option

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

###############################################################################

@manager.command
def execute (source):
    """Execute source in application context"""
    with app.app_context (): exec source

###############################################################################

class DbInit (Command):
    """Init database tables (with a default admin)"""

    def get_options (self):

        return [
            Option ('-n', '--name', dest='name', default=u'admin'),
            Option ('-m', '--mail', dest='mail', default=u'admin@mail.net'),
        ]

    def run (self, name, mail):
        db.create_all ()

        assert name
        assert mail
        user = User (name=name, mail=mail)

        db.session.add (user)
        db.session.commit ()

manager.add_command ('db-init', DbInit ())

###############################################################################

class DbDrop (Command):
    """Drops database tables"""

    def run (self):
        db.drop_all ()

manager.add_command ('db-drop', DbDrop ())

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
