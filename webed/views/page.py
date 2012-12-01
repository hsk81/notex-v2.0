__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request
from flask.helpers import jsonify
from flask import Blueprint, session

from datetime import datetime

from ..models import Node, Leaf, User
from ..ext import db, logger
from ..app import app
from ..util import Q

import sys

###############################################################################
###############################################################################

page = Blueprint ('page', __name__)

###############################################################################
###############################################################################

@page.route ('/test/')
def test ():
    return main (page='home', template='index_test.html')

###############################################################################
###############################################################################

@page.route ('/home/')
def home (): return main (page='home')
@page.route ('/overview/')
def overview (): return main (page='overview')
@page.route ('/tutorial/')
def tutorial (): return main (page='tutorial')
@page.route ('/faq/')
def faq (): return main (page='faq')
@page.route ('/contact/')
def contact (): return main (page='contact')

@page.route ('/')
def main (page='home', template='index.html'):

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

    if 'reset' in request.args: db_reset (); init ()
    if 'refresh' in request.args: db_clean (); init ()

    return render_template (template, page=page, debug=app.debug)

@page.route ('/reset/')
def reset ():
    db_reset (); init ();
    return jsonify (dict (success=True))

@page.route ('/refresh/')
def refresh ():
    db_clean (); init ();
    return jsonify (dict (success=True))

def db_reset ():

    db.drop_all ()
    db.create_all ()

    user = User (u'admin', mail=u'admin@mail.net')
    db.session.add (user)
    db.session.commit ()

def db_clean ():

    if 'root_uuid' in session:
        base = Q (Node.query).one_or_default (uuid=session['root_uuid'])
        if base:
            db.session.delete (base)
            db.session.commit ()

def init ():

    base = Node ('root', root=None)
    db.session.add (base)
    db.session.commit ()

    init_article (root=base)
    init_report (root=base)

    leaf = Leaf ('author.txt', root=base, mime='text/plain')
    db.session.add (leaf)
    leaf = Leaf ('about.tiff', root=base, mime='image/tiff')
    db.session.add (leaf)
    db.session.commit ()

    session['root_uuid'] = base.uuid

def init_article (root):

    node = Node ('Article', root, mime='application/project')
    db.session.add (node)
    leaf = Leaf ('options.cfg', node, mime='text/plain')
    db.session.add (leaf)
    leaf = Leaf ('content.txt', node, mime='text/plain')
    db.session.add (leaf)

    node = Node ('resources', node, mime='application/folder')
    db.session.add (node)
    leaf = Leaf ('wiki.png', node, mime='image/png')
    db.session.add (leaf)
    leaf = Leaf ('time.jpg', node, mime='image/jpg')
    db.session.add (leaf)

def init_report (root):

    node = Node ('Report', root, mime='application/project')
    db.session.add (node)
    leaf = Leaf ('options.cfg', node, mime='text/plain')
    db.session.add (leaf)
    leaf = Leaf ('content.txt', node, mime='text/plain')
    db.session.add (leaf)

    node = Node ('resources', node, mime='application/folder')
    db.session.add (node)
    leaf = Leaf ('wiki.png', node, mime='image/png')
    db.session.add (leaf)
    leaf = Leaf ('time.jpg', node, mime='image/png')
    db.session.add (leaf)

###############################################################################
###############################################################################

app.register_blueprint (page)

###############################################################################
###############################################################################
