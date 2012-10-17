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

class Query:

    def __init__ (self, query):

        self.query = query

    def single (self, **kwargs):

        return self.query.filter_by (**kwargs).one ()

    def single_or_default (self, default=None, **kwargs):

        query = self.query.filter_by (**kwargs)
        return query.one () if query.count () == 1 else default

###############################################################################
###############################################################################

class Set (db.Model):
    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    name = db.Column (db.Unicode (256))

    root_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    subsets = db.relationship ('Set', cascade='all', backref=db.backref ("root",
        remote_side='Set.id'))

    def __init__ (self, name, root=None, uuid=None):
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.root = root

    def __repr__ (self):
        return '<Set %r>' % self.name

class Doc (db.Model):
    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    name = db.Column (db.Unicode (256))
    ext = db.Column (db.Unicode (16))

    set_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    set = db.relationship ('Set', backref=db.backref ('docs', lazy='dynamic'))

    def __init__ (self, name, ext, set, uuid=None):
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.ext = unicode (ext)
        self.set = set

    def __repr__ (self):
        return u'<Doc %r>' % (self.name + u'.' + self.ext)

    fullname = property (lambda self: '%s.%s' % (self.name, self.ext))

###############################################################################
###############################################################################

@app.route ('/')
def main ():
    if 'timestamp' in session and 'reset' not in request.args:
        session['timestamp'] = datetime.now ()
    else:
        session['timestamp'] = datetime.now ()
        reset (); init ()

    if not request.args.get ('silent', False):
        if app.session_cookie_name in request.cookies:
            session_cn = app.session_cookie_name
            session_id = request.cookies[session_cn].split ('?')[0]
        else:
            session_id = None

        print >> sys.stderr, "Session ID: %s" % session_id
        print >> sys.stderr, "Time Stamp: %s" % session['timestamp']

    return render_template ('index.html')

def reset ():
    db.drop_all ()
    db.create_all ()

def init ():
    init_article ()
    init_report ()

def init_article ():
    set = Set ('Article'); db.session.add (set)
    doc = Doc ('options', 'cfg', set); db.session.add (doc)
    doc = Doc ('content', 'txt', set); db.session.add (doc)
    subset = Set ('resources', root=set); db.session.add (subset)
    doc = Doc ('wiki', 'png', subset); db.session.add (doc)
    doc = Doc ('time', 'jpg', subset); db.session.add (doc)
    db.session.commit ()

def init_report ():
    set = Set ('Report'); db.session.add (set)
    doc = Doc ('options', 'cfg', set); db.session.add (doc)
    doc = Doc ('content', 'txt', set); db.session.add (doc)
    subset = Set ('resources', root=set); db.session.add (subset)
    doc = Doc ('wiki', 'png', subset); db.session.add (doc)
    doc = Doc ('time', 'jpg', subset); db.session.add (doc)
    db.session.commit ()

###############################################################################
###############################################################################

@app.route ('/sets', methods=['PUT', 'GET', 'POST', 'DELETE'])
def sets ():
    """
    TODO: Check out also if Flask-Restless is an option!
    """
    if request.method == 'PUT':
        return set_create ()

    elif request.method == 'GET':
        return set_read (request.args.get ('uuid', None))

    elif request.method == 'POST':
        return set_create ()
     ## return set_update (None) ## TODO!

    elif request.method == 'DELETE':
        return set_delete (None) ## TODO!

    else:
        return jsonify (success=False)


@app.route ('/sets/root')
def sets_root (json=True):

    sets = Set.query.filter_by (root=None).all ()
    result = {
        'success': True, 'results': map (set2ext, sets)
    }

    return jsonify (result) if json else result

def set_create (json=True):

    root = request.json.get ('root', None)
    uuid = request.json.get ('uuid', None)
    name = request.json.get ('name', uuid)

    root = Query (Set.query).single_or_default (uuid=root)

    set = Set (name, root=root, uuid=uuid)
    db.session.add (set)
    db.session.commit ()

    result = {
        'success': True, 'results': map (set2ext, [set])
    }

    return jsonify (result) if json else result

def set_read (uuid, json=True):

    if not uuid:
        sets = Set.query.all ()
    else:
        sets = Set.query.filter_by (uuid=uuid).all ()

    result = {
        'success': True, 'results': map (set2ext, sets)
    }

    return jsonify (result) if json else result

def set_update (uuid):
    return jsonify (success=True, uuid=uuid)

def set_delete (uuid):
    return jsonify (success=True, uuid=uuid)

###############################################################################
###############################################################################

@app.route ('/docs', methods=['PUT', 'GET', 'POST', 'DELETE'])
def docs ():
    """
    TODO: Check out also if Flask-Restless is an option!
    """
    if request.method == 'PUT':
        return doc_create (None) ## TODO!
    elif request.method == 'GET':
        return doc_read (request.args.get ('uuid', None))
    elif request.method == 'POST':
        return doc_update (None) ## TODO!
    elif request.method == 'DELETE':
        return doc_delete (None) ## TODO!
    else:
        return jsonify (success=False)

def doc_create (uuid):
    return jsonify (success=True, id=1, uuid=uuid)

def doc_read (uuid, json=True):

    if not uuid:
        docs = Doc.query.all ()
    else:
        docs = Doc.query.filter_by (uuid=uuid).all ()

    result = {
        'success': True, 'results': map (doc2ext, docs)
    }

    return jsonify (result) if json else result

def doc_update (uuid):
    return jsonify (success=True, uuid=uuid)

def doc_delete (uuid):
    return jsonify (success=True, uuid=uuid)

###############################################################################
###############################################################################

def set2ext (set):

    docs = map (lambda doc: doc2ext (doc, fullname=True), set.docs)
    sets = map (lambda set: set2ext (set), set.subsets)

    iconCls = 'icon-report' if not set.root else 'icon-folder' ## TODO: '-16'!
    size = 0 ## TODO!

    return {
        'root': set.root.uuid if set.root else None,
        'uuid': set.uuid,
        'name': set.name,
        'size': size,
        'loaded': True,
        'iconCls': iconCls,
        'results': docs + sets,
    }

def doc2ext (doc, fullname=False):
    """
    TODO: ExtJS should be able to stitch together fullname from name and ext,
          which ExtJS is able to do for the grid, but not for the tree. Look
          for a way to compose the fullname also for the tree! The `fullname`
          parameter should ideally just be eliminated.
    """

    size = 0 ## TODO!
    iconCls = 'icon-page', ## TODO: 'icon-page/picture-16'!

    return {
        'uuid': doc.uuid,
        'name': doc.fullname if fullname else  doc.name,
        'ext': doc.ext,
        'size':size,
        'loaded': True,
        'iconCls': iconCls
    }

###############################################################################
###############################################################################

if __name__ == '__main__':

    app.run (debug=True)

###############################################################################
###############################################################################
