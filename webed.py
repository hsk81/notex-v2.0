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
    size = db.Column (db.BigInteger)

    set_id = db.Column (db.Integer, db.ForeignKey ('set.id'))
    set = db.relationship ('Set', backref=db.backref ('docs', lazy='dynamic'))

    def __init__ (self, name, ext, size, set, uuid=None):
        self.uuid = uuid if uuid else str (uuid_random ())
        self.name = unicode (name)
        self.ext = unicode (ext)
        self.size = size
        self.set = set

    def __repr__ (self):
        return u'<Doc %r>' % (self.name + u'.' + self.ext)

###############################################################################
###############################################################################

@app.route ('/')
def main ():
    if 'timestamp' in session and 'refresh' not in request.args:
        session['timestamp'] = datetime.now ()
    else:
        session['timestamp'] = datetime.now ()
        init ()

    if not request.args.get ('silent', False):
        if app.session_cookie_name in request.cookies:
            session_cn = app.session_cookie_name
            session_id = request.cookies[session_cn].split ('?')[0]
        else:
            session_id = None

        print >> sys.stderr, "Session ID: %s" % session_id
        print >> sys.stderr, "Time Stamp: %s" % session['timestamp']

    return render_template ('index.html')


def init ():
    sets = Set.query.all (); print '[init] sets:', sets
    docs = Doc.query.all (); print '[init] docs:', docs

###############################################################################
###############################################################################

@app.route ('/sets/', methods=['PUT', 'GET', 'POST', 'DELETE'])
def sets ():
    if request.method == 'PUT':
        return set_create (None) ## TODO!
    elif request.method == 'GET':
        return set_read (request.args.get ('node', None))
    elif request.method == 'POST':
        return set_update (None) ## TODO!
    elif request.method == 'DELETE':
        return set_delete (None) ## TODO!
    else:
        return jsonify (success=False)


def set_create (uuid):
    return jsonify (success=True, id=1, uuid=uuid)


def set_read (id):
    if id == 0 or id == '0':
        return jsonify (success=True, id=id, children=[{
            'id': 1, 'uuid': '488989dc-b789-4729-9fb1-65fe6337f9c2',
            'name': 'R-XY', 'size': 0, 'loaded': True
        }, {
            'id': 2, 'uuid': 'ba11ec2b-8473-44bb-ba8e-5058a42f7b94',
            'name': 'R-XZ', 'size': 0, 'loaded': True
        }, {
            'id': 3, 'uuid': '85f8190c-c074-49af-9d02-a460cd609c6f',
            'name': 'R-YZ', 'size': 0, 'loaded': False, 'expanded': False
        }])

    else:
        return jsonify (success=True, id=id, children=[])


def set_update (id):
    return jsonify (success=True, id=id)


def set_delete (id):
    return jsonify (success=True, id=id)

###############################################################################
###############################################################################

if __name__ == '__main__':
    app.run (debug=True)

###############################################################################
###############################################################################
