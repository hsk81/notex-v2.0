#!bin/python

###############################################################################
###############################################################################

from flask.ext.script import Manager, Command, Option
from flask.ext.assets import ManageAssets

from webed.util import Q
from webed.app import app
from webed.ext import db
from webed.ext import std_cache
from webed.ext import obj_cache
from webed.ext import sss_cache
from webed.ext import dbs_cache
from webed.ext import assets
from webed.models import User

from gzip import GzipFile

import os
import shutil
import subprocess

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
    """Setup database (with a default admin) [!!]"""

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
    """Clear database [!!]"""

    def run (self):

        db.session.script (['webed', 'models', 'sql', 'npv_drop.sql'])
        db.session.script (['webed', 'models', 'sql', 'npt_drop.sql'])
        db.session.commit ()
        db.drop_all ()

manager.add_command ('clear-db', DbClear ())

###############################################################################

class StdCacheClear (Command):
    """Clear standard cache (views, templates etc.)"""

    def run (self):
        std_cache.connection.flushdb () ## redis

manager.add_command ('clear-cache-std', StdCacheClear ())

class ObjCacheClear (Command):
    """Clear object cache (archives etc.)"""

    def run (self):
        obj_cache.connection.flushdb () ## redis

manager.add_command ('clear-cache-obj', ObjCacheClear ())

class SssCacheClear (Command):
    """Clear session cache (anchor etc.) [!!]"""

    def run (self):
        sss_cache.connection.flushdb () ## redis

manager.add_command ('clear-cache-sss', SssCacheClear ())

class DbsCacheClear (Command):
    """Clear database system cache (version-ing etc.) [!!]"""

    def run (self):
        dbs_cache.connection.flushdb () ## redis

manager.add_command ('clear-cache-dbs', DbsCacheClear ())

class FsbCacheClear (Command):
    """Clear file system backend cache (data etc.) [!!]"""

    def run (self):
        path = app.config['FS_CACHE']
        if os.path.exists (path): shutil.rmtree (path)
        os.mkdir (path)

manager.add_command ('clear-cache-fsb', FsbCacheClear ())

###############################################################################

class AppReset (Command):
    """Reset application: Clear all caches and reset DB [!!]"""

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
        ObjCacheClear ().run ()
        SssCacheClear ().run ()
        DbsCacheClear ().run ()
        FsbCacheClear ().run ()

        DbClear ().run ()
        DbSetup ().run (name=name, mail=mail)

manager.add_command ('reset', AppReset ())

###############################################################################

class AppRefresh (Command):
    """Refresh application: Clears standard and object cache"""

    def run (self):

        StdCacheClear ().run ()
        ObjCacheClear ().run ()

manager.add_command ('refresh', AppRefresh ())

###############################################################################
###############################################################################

class AssetsSprite (Command):
    """Creates a CSS sprite using `spritemapper`"""

    def get_options (self):

        return [
            Option ('-n', '--name', dest='name', default='sprite-main'),
        ]

    def run (self, *args, **kwargs):

        theme_path = os.path.join (
            'webed', 'static', 'webed-ext', 'resources', 'theme')

        name = kwargs['name']
        assert name

        ini_path = os.path.join (theme_path, '%s.ini' % name)
        src_path = os.path.join (theme_path, '%s-in.css' % name)
        css_path = os.path.join (theme_path, '%s.css' % name)

        subprocess.check_call ([
            'spritemapper', '--conf=' + ini_path, src_path
        ])

        subprocess.check_call ([
            'sed', '--in-place', 's/; \}/ !important; \}/g', css_path
        ])

class AssetsGzip (Command):
    """Gzip assets: Pre-compresses assets"""

    def get_options (self):

        return [
            Option ('-l', '--compress-level', dest='level', default=6,
                    choices=range (1, 10), type=int),
            Option ('-f', '--force', dest='force', action='store_true',
                    default=False, help='Overrides existing compressed asset')
        ]

    def run (self, *args, **kwargs):

        level = kwargs['level']
        assert 1 <= level <= 9
        force = kwargs['force']
        assert type (force) == bool

        directory = assets.get_directory ()
        assert directory

        for asset in assets:
            source_path = asset.resolve_output ()
            target_path = '%s.gz' % source_path
            bundle_path = target_path[len (directory) + 1:]

            if not os.path.exists (target_path) or force:
                print 'Compressing bundle: %s' % bundle_path

                with open (source_path, 'rb') as source:
                    with open (target_path, 'wb') as target:

                        gz = GzipFile (
                            mode='wb', compresslevel=level, fileobj=target)

                        try: gz.write (source.read ())
                        finally: gz.close ()
            else:
                print 'Skipped bundle: %s' % bundle_path

manager.add_command ('assets-sprite', AssetsSprite ())
manager.add_command ('assets-gzip', AssetsGzip ())
manager.add_command ('assets', ManageAssets ())

###############################################################################
###############################################################################

if __name__ == '__main__':

    manager.run ()

###############################################################################
###############################################################################
