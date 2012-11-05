#!bin/python

###############################################################################
###############################################################################

from flask import session
from flask.app import Flask
from flask.globals import request
from flask.helpers import jsonify
from flask.ext.admin import Admin
from flask.views import MethodView
from flask.ext.sqlalchemy import SQLAlchemy
from flask.templating import render_template
from flask.ext.admin.contrib.fileadmin import FileAdmin
from flask.ext.admin.contrib.sqlamodel import ModelView
from flask.ext.debugtoolbar import DebugToolbarExtension

from datetime import datetime
from uuid import uuid4 as uuid_random

import sys
import os.path
import settings

###############################################################################
###############################################################################

app = Flask (__name__)
app.config.from_object (settings)
app.config.from_envvar ('WEBED_SETTINGS', silent=True)

toolbar = DebugToolbarExtension (app)
db = SQLAlchemy (app)
admin = Admin (app)

###############################################################################
###############################################################################

class Q:

    def __init__ (self, query):

        self.query = query

    def all (self, **kwargs):

        return self.query.filter_by (**kwargs).all ()

    def all_or_default (self, default=None, **kwargs):

        query = self.query.filter_by (**kwargs)
        return query.all () if query.count () >= 1 else default

    def one (self, **kwargs):

        return self.query.filter_by (**kwargs).one ()

    def one_or_default (self, default=None, **kwargs):

        query = self.query.filter_by (**kwargs)
        return query.one () if query.count () == 1 else default

###############################################################################
###############################################################################

class Set (db.Model):

    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    mime = db.Column (db.String (256))
    name = db.Column (db.Unicode (256))

    ##
    ## Set.subsets = Q (Set.query).all (base=set) for a set, which means that
    ## for any *non-base* "set": Q (set.subsets).all () = [].
    ##

    base_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    subsets = db.relationship ('Set',
        cascade='all', lazy='dynamic',
        primaryjoin="Set.base_id==Set.id",
        backref=db.backref ('base', remote_side='Set.id'))

    ##
    ## Set.sets = Q (Set.query).all (root=set) for a set, which means only the
    ## *immediate* sets for a given set.
    ##

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    sets = db.relationship ('Set',
        cascade='all', lazy='dynamic',
        primaryjoin="Set.root_id==Set.id",
        backref=db.backref ('root', remote_side='Set.id'))

    def __init__ (self, name, root, uuid=None, mime=None):

        self.base = root.base if root and root.base else root
        self.uuid = uuid if uuid else str (uuid_random ())
        self.mime = mime if mime else 'application/set'
        self.name = unicode (name)
        self.root = root

    def __repr__ (self):

        return '<Set %r>' % self.name

class Doc (db.Model):

    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    mime = db.Column (db.String (256))
    name = db.Column (db.Unicode (256))
    ext = db.Column (db.Unicode (16))

    ##
    ## Set.subdocs = Q (Doc.query).all (base=set) for a set, which means that
    ## for any *non-base* "set": Q (set.subdocs).all () = [].
    ##

    base_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    base = db.relationship ('Set', primaryjoin="Doc.base_id==Set.id",
        backref=db.backref ('subdocs', lazy='dynamic', cascade='all'))

    ##
    ## Set.docs = Q (Doc.query).all (root=set) for a set, which means only the
    ## *immediate* docs for a given set.
    ##

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    root = db.relationship ('Set', primaryjoin="Doc.root_id==Set.id",
        backref=db.backref ('docs', lazy='dynamic', cascade='all'))

    def __init__ (self, name, ext, root, uuid=None, mime=None):

        self.base = root.base if root and root.base else root
        self.mime = mime if mime else 'application/document'
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.ext = unicode (ext)
        self.root = root

    def __repr__ (self):

        return u'<Doc %r>' % (self.name + u'.' + self.ext)

    fullname = property (lambda self: '%s.%s' % (self.name, self.ext))

###############################################################################
###############################################################################

class SetAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name')
    searchable_columns = (Set.uuid, Set.mime, Set.name)
    column_filters = (Set.uuid, Set.mime, Set.name)

    def __init__ (self, session):
        super (SetAdmin, self).__init__(Set, session)

class DocAdmin (ModelView):

    list_columns = ('base', 'root', 'uuid', 'mime', 'name', 'ext')
    searchable_columns = (Doc.uuid, Doc.mime, Doc.name, Doc.ext)
    column_filters = (Doc.uuid, Doc.mime, Doc.name, Doc.ext)

    def __init__ (self, session):
        super (DocAdmin, self).__init__(Doc, session)

admin.add_view (SetAdmin (db.session))
admin.add_view (DocAdmin (db.session))

path = os.path.join (os.path.dirname (__file__), 'static')
admin.add_view (FileAdmin (path, '/static/', name='Files'))

###############################################################################
###############################################################################

@app.route ('/home/')
def home (): return main (page='home')
@app.route ('/overview/')
def overview (): return main (page='overview')
@app.route ('/tutorial/')
def tutorial (): return main (page='tutorial')
@app.route ('/faq/')
def faq (): return main (page='faq')
@app.route ('/contact/')
def contact (): return main (page='contact')

@app.route ('/')
def main (page='home'):

    if not 'timestamp' in session: init ()
    session['timestamp'] = datetime.now ()

    if app.session_cookie_name in request.cookies:
        session_cn = app.session_cookie_name
        session_id = request.cookies[session_cn].split ('?')[0]
    else:
        session_id = None

    if not request.args.get ('silent', False):

        print >> sys.stderr, "Session ID: %s" % session_id
        print >> sys.stderr, "Time Stamp: %s" % session['timestamp']

    if 'reset' in request.args: reset (); init ()
    if 'refresh' in request.args: clean (); init ()

    return render_template ('index.html', page=page, debug=app.debug)

def reset ():

    db.drop_all ()
    db.create_all ()

def clean ():

    if 'root_uuid' in session:
        base = Q (Set.query).one_or_default (uuid=session['root_uuid'])
        if base:
            db.session.delete (base)
            db.session.commit ()

def init ():

    base = Set ('root', root=None)
    db.session.add (base)
    db.session.commit ()

    init_article (root=base)
    init_report (root=base)

    doc = Doc ('author', 'txt', root=base, mime='text/plain')
    db.session.add (doc)
    db.session.commit ()

    session['root_uuid'] = base.uuid

def init_article (root):

    set = Set ('Article', root, mime='application/project'); db.session.add (set)
    doc = Doc ('options', 'cfg', set, mime='text/plain'); db.session.add (doc)
    doc = Doc ('content', 'txt', set, mime='text/plain'); db.session.add (doc)

    set = Set ('resources', set, mime='application/folder'); db.session.add (set)
    doc = Doc ('wiki', 'png', set, mime='image/png'); db.session.add (doc)
    doc = Doc ('time', 'jpg', set, mime='image/jpg'); db.session.add (doc)

def init_report (root):

    set = Set ('Report', root, mime='application/project'); db.session.add (set)
    doc = Doc ('options', 'cfg', set, mime='text/plain'); db.session.add (doc)
    doc = Doc ('content', 'txt', set, mime='text/plain'); db.session.add (doc)

    set = Set ('resources', set, mime='application/folder'); db.session.add (set)
    doc = Doc ('wiki', 'png', set, mime='image/png'); db.session.add (doc)
    doc = Doc ('time', 'jpg', set, mime='image/png'); db.session.add (doc)

###############################################################################
###############################################################################

class NodeApi (MethodView):

    def post (self, docs=True, json=True): return node_create (docs, json)
    def get (self, docs=True, json=True): return node_read (docs, json)
    def put (self, docs=True, json=True): return node_update (docs, json)
    def delete (self, docs=True, json=True): return node_delete (docs, json)

app.add_url_rule ('/node', view_func=NodeApi.as_view ('node'))

def node_create (docs=True, json=True):

    root_uuid = request.form.get ('root_uuid', None)
    assert root_uuid
    mime = request.form.get ('mime', None)
    assert mime
    uuid = request.form.get ('uuid', None)
    assert uuid or not uuid
    name = request.form.get ('name', None)
    assert name

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (Set.query).one_or_default (base=base, uuid=root_uuid, default=base)
    assert root

    if uuid:
        set = Set (name, root, mime=mime, uuid=uuid)
    else:
        set = Set (name, root, mime=mime)

    db.session.add (set)
    db.session.commit ()

    result = dict (success=True,
        results=map (lambda s: set2ext (s, docs=docs), [set]))

    return jsonify (result) if json else result

@app.route ('/node/root', methods=['GET'])
def node_read (docs=True, json=True):

    uuid = request.args.get ('uuid', session['root_uuid'])
    assert uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    node = Q (base.subsets).one_or_default (uuid=uuid, default=base)
    assert node

    doc2exts = map (lambda d: doc2ext (d, True), node.docs) if docs else []
    set2exts = map (lambda s: set2ext (s, docs=docs), node.sets)

    result = dict (success=True, results=set2exts + doc2exts)
    return jsonify (result) if json else result

def node_update (docs=True, json=True):

    result = dict (success=True)
    return jsonify (result) if json else result

def node_delete (docs=True, json=True):

    result = dict (success=True)
    return jsonify (result) if json else result

###############################################################################
###############################################################################

class SetsApi (MethodView):

    def post (self, json=True): return sets_create (json=json)
    def get (self, json=True): return sets_read (json=json)
    def put (self, json=True): return sets_update (json=json)
    def delete (self, json=True): return sets_delete (json=json)

app.add_url_rule ('/sets', view_func=SetsApi.as_view ('sets'))

def sets_create (json=True):
    return node_create (docs=False, json=json)

@app.route ('/sets/root', methods=['GET'])
def sets_read (json=True):
    return node_read (docs=False, json=json)

def sets_update (json=True):
    return node_update (docs=False, json=json)

def sets_delete (json=True):
    return node_delete (docs=False, json=json)

###############################################################################
###############################################################################

class DocsApi (MethodView):

    def post (self, json=True): return doc_create (json)
    def get (self, json=True): return doc_read (json)
    def put (self, json=True): return doc_update (json)
    def delete (self, json=True): return doc_delete (json)

app.add_url_rule ('/docs', view_func=DocsApi.as_view ('docs'))

def doc_create (json=True):

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name
    ext = request.json.get ('ext', None)
    assert ext or not ext

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (Set.query).one_or_default (base=base, uuid=root_uuid, default=base)
    assert root

    if uuid:
        doc = Doc (name, ext, root, mime=mime, uuid=uuid)
    else:
        doc = Doc (name, ext, root, mime=mime)

    db.session.add (doc)
    db.session.commit ()

    result = dict (success=True, results=map (lambda d: doc2ext (d), [doc]))
    return jsonify (result) if json else result

def doc_read (json=True):

    uuid = request.args.get ('uuid', None)
    assert uuid or not uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base

    if uuid:
        docs = Q (base.subdocs).all (uuid=uuid)
    else:
        docs = Q (base.subdocs).all ()

    result = dict (success=True, results=map (doc2ext, docs))
    return jsonify (result) if json else result

def doc_update (json=True):

    uuid = request.args.get ('uuid', None)
    assert uuid

    result = dict (success=True, uuid=uuid)
    return jsonify (result) if json else result

def doc_delete (json=True):

    uuid = request.args.get ('uuid', None)
    assert uuid

    result = dict (success=True, uuid=uuid)
    return jsonify (result) if json else result

###############################################################################
###############################################################################

def set2ext (set, docs=True):

    assert set
    assert set.uuid
    assert set.name
    assert set.mime
    assert set.root.uuid

    def to_ext (set, results):

        return {
            'loaded': results is not None,
            'root_uuid': set.root.uuid,
            'results': results,
            'expandable': True,
            'expanded': False,
            'uuid': set.uuid,
            'name': set.name,
            'mime': set.mime,
            'leaf': False,
            'size': 0,
        }

    if set.sets.count () + set.docs.count () >= settings.LOADSKIP_LIMIT:

        return to_ext (set, results=None)

    sets = map (lambda s: set2ext (s, docs=docs), set.sets)
    results = map (lambda doc: doc2ext (doc, fullname=True), set.docs) + sets \
        if docs else sets

    return to_ext (set, results=results)

def doc2ext (doc, fullname=False):

    assert doc
    assert doc.ext
    assert doc.uuid
    assert doc.mime
    assert doc.root.uuid
    assert doc.fullname if fullname else doc.name

    return {
        'name': doc.fullname if fullname else doc.name,
        'root_uuid': doc.root.uuid,
        'expandable': False,
        'expanded': False,
        'uuid': doc.uuid,
        'mime': doc.mime,
        'ext': doc.ext,
        'loaded': True,
        'leaf': True,
        'size': 0
    }

###############################################################################
###############################################################################

if __name__ == '__main__':

    app.run (debug=True) ## TODO: Switch off in production!

###############################################################################
###############################################################################
