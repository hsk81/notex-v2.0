#!bin/python

###############################################################################
###############################################################################

from webed.app import app
from webed.ext import db, cache
from webed.util import Q
from webed.models import User

from flask.ext.script import Manager, Command, Option

##############################################################################
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

class DbSetup (Command):
    """Setup database (with a default admin)"""

    def get_options (self):

        return [
            Option ('-n', '--name', dest='name', default=u'admin'),
            Option ('-m', '--mail', dest='mail', default=u'admin@mail.net'),
        ]

    def run (self, name, mail):
        db.create_all ()

        assert name, mail
        user = Q (User.query).one_or_default (mail=mail)
        if not user: db.session.add (User (name=name, mail=mail))

        db.session.script (['webed', 'models', 'sql', 'npv_create.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_insert.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_delete.sql'])
        db.session.commit ()

manager.add_command ('setup-db', DbSetup ())

###############################################################################

class DbClear (Command):
    """Clear database"""

    def run (self):

        db.session.script (['webed', 'models', 'sql', 'npv_drop.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_drop.sql'])
        db.session.commit ()
        db.drop_all ()

manager.add_command ('clear-db', DbClear ())

###############################################################################

class CacheClear (Command):
    """Clear cache to delete *all* keys"""

    def run (self):

        cache.flush_all ()

manager.add_command ('clear-cache', CacheClear ())

###############################################################################

class AppReset (Command):
    """Reset application: Clear cache & DB, and setup DB"""

    def get_options (self):

        return [
            Option ('-n', '--name', dest='name', default=u'admin'),
            Option ('-m', '--mail', dest='mail', default=u'admin@mail.net'),
        ]

    def run (self, name, mail):
        assert name, mail

        CacheClear ().run ()
        DbClear ().run ()
        DbSetup ().run (name=u'admin', mail=u'admin@mail.net')

manager.add_command ('reset', AppReset ())

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
