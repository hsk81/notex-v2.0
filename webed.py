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

class Set (db.Model):
    id = db.Column (db.Integer, primary_key=True)
    uuid = db.Column (db.String (36), unique=True)
    name = db.Column (db.Unicode (256))

    def __init__ (self, name, uuid=None):
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)

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
    if 'timestamp' in session and 'refresh' not in request.args:
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
    db.session.commit ()

def init_report ():
    set = Set ('Report'); db.session.add (set)
    doc = Doc ('options', 'cfg', set); db.session.add (doc)
    doc = Doc ('content', 'txt', set); db.session.add (doc)
    db.session.commit ()

###############################################################################
###############################################################################

@app.route ('/sets/', methods=['PUT', 'GET', 'POST', 'DELETE'])
def sets ():
    """
    TODO: Check out also if Flask-Restless is an option!
    """
    if request.method == 'PUT':
        return set_create (None) ## TODO!
    elif request.method == 'GET':
        return set_read (request.args.get ('uuid', None))
    elif request.method == 'POST':
        return set_update (None) ## TODO!
    elif request.method == 'DELETE':
        return set_delete (None) ## TODO!
    else:
        return jsonify (success=False)

def set_create (uuid):
    return jsonify (success=True, id=1, uuid=uuid)

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

@app.route ('/docs/', methods=['PUT', 'GET', 'POST', 'DELETE'])
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

    return {
        'uuid': set.uuid,
        'name': set.name,
        'size': 0, ## TODO!
        'loaded': True,
        'iconCls': 'icon-report', ## TODO: 'icon-report-16'!
        'results': map (lambda doc: doc2ext (doc, fullname=True), set.docs),
    }

def doc2ext (doc, fullname=False):
    """
    TODO: ExtJS should be able to stitch together fullname from name and ext,
          which ExtJS is able to do for the grid, but not for the tree. Look
          for a way to compose the fullname also for the tree! The `fullname`
          parameter should ideally just be eliminated.
    """
    return {
        'uuid': doc.uuid,
        'name': doc.fullname if fullname else  doc.name,
        'ext': doc.ext,
        'size': 0, ## TODO!
        'loaded': True,
        'iconCls': 'icon-page', ## TODO: 'icon-page/picture-16'!
    }

###############################################################################
###############################################################################

if __name__ == '__main__':

    app.run (debug=True)

###############################################################################
###############################################################################
