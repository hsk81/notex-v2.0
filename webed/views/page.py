__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request
from flask import session

from datetime import datetime

from webed.models import Set, Doc
from webed.extensions import db
from webed.app import app
from webed.linq import Q

import sys

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
