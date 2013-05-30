__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy import create_engine, orm
from sqlalchemy.ext.declarative import declarative_base, declared_attr

from ..app import app

import re
import os.path
import functools
import sqlalchemy

###############################################################################
###############################################################################

class WebedSession (orm.Session):

    def script (self, path):

        if isinstance (path, list):
            path = os.path.sep.join (path)
        with open (path) as file:
            sql = file.read ()

        self.execute (sql)

class WebedQuery (orm.Query):

    orm.Query.back = orm.Query.reset_joinpoint

class WebedBase (object):

    @declared_attr
    def __tablename__ (cls):
        return cls.convert (cls.__name__)

    rx_1st_cap = re.compile (r'(.)([A-Z][a-z]+)')
    rx_all_cap = re.compile (r'([a-z0-9])([A-Z])')

    @classmethod
    def convert (cls, value):
        value = cls.rx_1st_cap.sub (r'\1_\2', value)
        value = cls.rx_all_cap.sub (r'\1_\2', value)
        return value.lower()

    query_class = WebedQuery
    query = None

class WebedOrm (object):

    def __init__ (self, app, uri=None, echo=None):

        if app is not None:
            self.app = app
            self.init_app (self.app)
        else:
            self.app = None

    def init_app (self, app, uri=None, echo=None):

        app.config.setdefault ('SQLALCHEMY_ECHO', False)
        app.config.setdefault ('SQLALCHEMY_DATABASE_URI', 'sqlite:///:memory:')

        self.ECHO = echo \
            if echo is not None else app.config['SQLALCHEMY_ECHO']
        assert self.ECHO is not None
        self.URI = uri \
            if uri is not None else app.config['SQLALCHEMY_DATABASE_URI']
        assert self.URI

        self.engine = create_engine (self.URI, echo=self.ECHO)
        self.session_maker = orm.sessionmaker (self.engine, WebedSession)
        self.session_manager = orm.scoped_session (self.session_maker)

        self.Model = declarative_base (cls=WebedBase)
        self.Model.query = \
            self.session_manager.query_property (query_cls=WebedQuery)

        @app.teardown_appcontext
        def on_teardown (exception):
            self.session_manager.remove ()

    def __repr__(self):

        return u'<WebedOrm: engine=%r>' % self.URI

    @property
    def session (self):

        return self.session_manager ()

    def commit (self, fn=None, unless=None, lest=None):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)
                if callable (lest) and lest (*args, **kwargs) is True:
                    return fn (*args, **kwargs)

                try:
                    result = fn (*args, **kwargs)
                    self.session.commit ()
                    return result
                except:
                    self.session.rollback ()
                    raise

            return decorated
        return decorator (fn) if fn else decorator

    def nest (self, fn=None, unless=None, lest=None):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless () is True:
                    return fn (*args, **kwargs)
                if callable (lest) and lest (*args, **kwargs) is True:
                    return fn (*args, **kwargs)

                self.session.begin (nested=True)

                try:
                    result = fn (*args, **kwargs)
                    self.session.commit ()
                    return result
                except:
                    self.session.rollback ()
                    raise

            return decorated
        return decorator (fn) if fn else decorator

    def create_all (self):
        self.Model.metadata.create_all (self.engine)

    def drop_all (self):
        self.Model.metadata.drop_all (self.engine)

    def __getattr__ (self, item):
        return getattr (sqlalchemy, item)

###############################################################################
###############################################################################

db = WebedOrm (app)

###############################################################################
###############################################################################
