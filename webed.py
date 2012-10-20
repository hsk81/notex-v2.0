#!bin/python

###############################################################################
###############################################################################

from flask import session
from flask.app import Flask
from flask.globals import request
from flask.helpers import jsonify
from flask.templating import render_template
from flask.ext.debugtoolbar import DebugToolbarExtension
from flask.ext.sqlalchemy import SQLAlchemy

from datetime import datetime
from uuid import uuid4 as uuid_random

import sys
import settings

###############################################################################
###############################################################################

app = Flask (__name__)
app.config.from_object (settings)
app.config.from_envvar ('WEBED_SETTINGS', silent=True)

toolbar = DebugToolbarExtension (app)
db = SQLAlchemy (app)

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
    name = db.Column (db.Unicode (256))

    ##
    ## TODO: type (Set.subsets) == InstrumentedList, and != AppenderBaseQuery;
    ##

    base_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    subsets = db.relationship ('Set', primaryjoin="Set.base_id==Set.id",
        backref=db.backref ('base', remote_side='Set.id'), cascade='all')

    ##
    ## TODO: type (Set.sets) == InstrumentedList, and != AppenderBaseQuery;
    ##

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    sets = db.relationship ('Set', primaryjoin="Set.root_id==Set.id",
        backref=db.backref ('root', remote_side='Set.id'), cascade='all')

    def __init__ (self, name, root, base, uuid=None):

        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.root = root
        self.base = base

    def __repr__ (self):
        return '<Set %r>' % self.name

class Doc (db.Model):
    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    name = db.Column (db.Unicode (256))
    ext = db.Column (db.Unicode (16))

    base_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    base = db.relationship ('Set', primaryjoin="Doc.base_id==Set.id",
        backref=db.backref ('subdocs', lazy='dynamic'))

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    root = db.relationship ('Set', primaryjoin="Doc.root_id==Set.id",
        backref=db.backref ('docs', lazy='dynamic'))

    def __init__ (self, name, ext, root, base, uuid=None):
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.ext = unicode (ext)
        self.root = root
        self.base = base

    def __repr__ (self):
        return u'<Doc %r>' % (self.name + u'.' + self.ext)

    fullname = property (lambda self: '%s.%s' % (self.name, self.ext))

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
    if 'refresh' in request.args: init ()

    return render_template ('index.html', page=page, debug=app.debug)

def reset ():

    db.drop_all ()
    db.create_all ()

def init ():

    root = Set ('root', root=None, base=None)
    session['root_uuid'] = root.uuid

    db.session.add (root)
    db.session.commit ()

    init_article (root=root, base=root)
    init_report (root=root, base=root)

def init_article (root, base):

    set = Set ('Article', root, base); db.session.add (set)
    doc = Doc ('options', 'cfg', set, base); db.session.add (doc)
    doc = Doc ('content', 'txt', set, base); db.session.add (doc)
    set = Set ('resources', set, base); db.session.add (set)
    doc = Doc ('wiki', 'png', set, base); db.session.add (doc)
    doc = Doc ('time', 'jpg', set, base); db.session.add (doc)
    db.session.commit ()

def init_report (root, base):

    set = Set ('Report', root, base); db.session.add (set)
    doc = Doc ('options', 'cfg', set, base); db.session.add (doc)
    doc = Doc ('content', 'txt', set, base); db.session.add (doc)
    set = Set ('resources', set, base); db.session.add (set)
    doc = Doc ('wiki', 'png', set, base); db.session.add (doc)
    doc = Doc ('time', 'jpg', set, base); db.session.add (doc)
    db.session.commit ()

###############################################################################
###############################################################################

##
## TODO: Check out also if Flask-Restless is an option! PUT & DELETE required?
##

###############################################################################
###############################################################################

@app.route ('/node', methods=['POST', 'GET', 'PUT', 'DELETE'])
def node (docs=True, json=True):

    if request.method == 'POST': return node_create (docs, json)
    elif request.method == 'GET': return node_read (docs, json)
    elif request.method == 'PUT': return node_update (docs, json)
    elif request.method == 'DELETE': return node_delete (docs, json)

    else:
        result = {
            'success': False
        }

        return jsonify (result) if json else result

@app.route ('/node/root', methods=['GET'])
def node_root (docs=True, json=True):

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    sets = Q (Set.query).all (base=base, root=base)
    assert type (sets) == list

    result = {
        'success': True, 'results': map (lambda s: set2ext (s, docs), sets)
    }

    return jsonify (result) if json else result

def node_create (docs=True, json=True):

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    name = request.json.get ('name', None)
    assert name

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (Set.query).one_or_default (base=base, uuid=root_uuid,
        default=base)
    assert root

    if uuid:
        set = Set (name, base=base, root=root, uuid=uuid)
        assert set
    else:
        set = Set (name, base=base, root=root)
        assert set

    db.session.add (set)
    db.session.commit ()

    result = {
        'success': True, 'results': map (lambda s: set2ext (s, docs), [set])
    }

    return jsonify (result) if json else result

def node_read (docs=True, json=True):

    uuid = request.args.get ('uuid', None)
    assert uuid or not uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base

    if uuid:
        sets = Q (Set.query).all (base=base, uuid=uuid)
        assert type (sets) == list
    else:
        sets = Q (Set.query).all (base=base)
        assert type (sets) == list

    result = {
        'success': True, 'results': map (lambda s: set2ext (s, docs), sets)
    }

    return jsonify (result) if json else result

def node_update (docs=True, json=True):

    result = {
        'success': True
    }

    return jsonify (result) if json else result

def node_delete (docs=True, json=True):

    result = {
        'success': True
    }

    return jsonify (result) if json else result

###############################################################################
###############################################################################

@app.route ('/sets', methods=['PUT', 'GET', 'POST', 'DELETE'])
def sets (json=True):
    return node (docs=False, json=json)

@app.route ('/sets/root', methods=['GET'])
def sets_root (json=True):
    return node_root (docs=False, json=json)

###############################################################################
###############################################################################

@app.route ('/docs', methods=['POST', 'GET', 'PUT', 'DELETE'])
def docs (json=True):

    if request.method == 'POST': return doc_create (json)
    elif request.method == 'GET': return doc_read (json)
    elif request.method == 'PUT': return doc_update (json)
    elif request.method == 'DELETE': return doc_delete (json)

    else:
        result = {
            'success': False
        }

        return jsonify (result) if json else result

def doc_create (json=True):

    result = {
        'success': True, 'uuid': request.args.get ('uuid', None)
    }

    return jsonify (result) if json else result

def doc_read (json=True):

    uuid = request.args.get ('uuid', None)
    assert uuid or not uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base

    if uuid:
        docs = Q (Doc.query).all (base=base, uuid=uuid)
        assert type (docs) == list
    else:
        docs = Q (Doc.query).all (base=base)
        assert type (docs) == list

    result = {
        'success': True, 'results': map (doc2ext, docs)
    }

    return jsonify (result) if json else result

def doc_update (json=True):

    result = {
        'success': True, 'uuid': request.args.get ('uuid', None)
    }

    return jsonify (result) if json else result

def doc_delete (json=True):

    result = {
        'success': True, 'uuid': request.args.get ('uuid', None)
    }

    return jsonify (result) if json else result

###############################################################################
###############################################################################

def set2ext (set, docs=True):

    assert set;
    assert set.root.uuid
    assert set.uuid
    assert set.name

    size = 0
    leaf = False
    loaded = True

    sets = map (lambda set: set2ext (set, docs), set.sets)
    assert type (sets) == list
    results = sets

    if docs:
        docs = map (lambda doc: doc2ext (doc, fullname=True), set.docs)
        assert type (docs) == list
        results = docs + results

    return {
        'root_uuid': set.root.uuid,
        'uuid': set.uuid,
        'name': set.name,
        'size': size,
        'leaf': leaf,
        'loaded': loaded,
        'results': results
    }

def doc2ext (doc, fullname=False):

    assert doc
    assert doc.root.uuid
    assert doc.uuid
    assert doc.fullname if fullname else doc.name
    assert doc.ext

    size = 0 ## TODO!
    loaded = True
    leaf = True

    return {
        'root_uuid': doc.root.uuid,
        'uuid': doc.uuid,
        'name': doc.fullname if fullname else doc.name,
        'ext': doc.ext,
        'size': size,
        'leaf': leaf,
        'loaded': loaded,
    }

###############################################################################
###############################################################################

if __name__ == '__main__':

    app.run (debug=True) ## TODO: Switch off in production!

###############################################################################
###############################################################################
