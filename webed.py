#!bin/python

###############################################################################
###############################################################################

from flask.ext.script import Manager, Command, Option

from webed.util import Q
from webed.app import app
from webed.models import User
from webed.ext import db

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

class DbSetup (Command):
    """Setup database (with a default admin)"""

    def get_options (self):

        return [
            Option ('-n', '--name', dest='name', default=u'admin'),
            Option ('-m', '--mail', dest='mail', default=u'admin@mail.net'),
        ]

    def run (self, *args, **kwargs):
        db.create_all ()

        name = kwargs['name']
        assert name
        mail = kwargs['mail']
        assert mail

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

class StdCacheClear (Command):
    """Prints command to clear standard cache (views)"""

    def run (self):
        print 'redis-cli KEYS "webed-std:*" | xargs redis-cli DEL'

manager.add_command ('clear-std-cache', StdCacheClear ())

class SssCacheClear (Command):
    """Prints command to clear session cache [DON'T!]"""

    def run (self):
        print 'redis-cli KEYS "webed-sss:*" | xargs redis-cli DEL'

manager.add_command ('clear-sss-cache', SssCacheClear ())

class VerCacheClear (Command):
    """Prints command to clear version-ing cache (DB) [DON'T!]"""

    def run (self):
        print 'redis-cli KEYS "webed-ver:*" | xargs redis-cli DEL'

manager.add_command ('clear-ver-cache', VerCacheClear ())

class TplCacheClear (Command):
    """Prints command to clear template cache"""

    def run (self):
        print 'redis-cli KEYS "webed-tpl:*" | xargs redis-cli DEL'

manager.add_command ('clear-tpl-cache', TplCacheClear ())

class ObjCacheClear (Command):
    """Prints command to clear object cache (archives etc.)"""

    def run (self):
        print 'redis-cli KEYS "webed-obj:*" | xargs redis-cli DEL'

manager.add_command ('clear-obj-cache', ObjCacheClear ())

class FsCacheClear (Command):
    """Prints command to clear file system cache/backend [DON'T]"""

    def run (self):
        print 'rm -r "%s" && mkdir "%s"' % (
            app.config['FS_CACHE'], app.config['FS_CACHE'])

manager.add_command ('clear-fs-cache', FsCacheClear ())

###############################################################################

class AppReset (Command):
    """Reset application: DON'T in production!"""

    def get_options (self):

        return [
            Option ('-n', '--name', dest='name', default=u'admin'),
            Option ('-m', '--mail', dest='mail', default=u'admin@mail.net'),
        ]

    def run (self, *args, **kwargs):

        name = kwargs['name']
        assert name
        mail = kwargs['mail']
        assert mail

        StdCacheClear ().run ()
        SssCacheClear ().run ()
        VerCacheClear ().run ()
        TplCacheClear ().run ()
        ObjCacheClear ().run ()
        FsCacheClear ().run ()

        DbClear ().run ()
        DbSetup ().run (name=name, mail=mail)

manager.add_command ('reset', AppReset ())

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
