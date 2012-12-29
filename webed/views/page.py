__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request
from flask import Blueprint, session

from datetime import datetime

from ..app import app
from ..models import *
from ..ext import db, cache
from ..util import Q, jsonify

import sys

###############################################################################
###############################################################################

page = Blueprint ('page', __name__)

###############################################################################
###############################################################################

def is_dev (): return app.debug or app.testing
def is_reset (): return 'reset' in request.args
def is_refresh (): return 'refresh' in request.args

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
#@cache.memoize (15, unless=lambda: is_dev () or is_refresh ())
def main (page='home', template='index.html'):

    if not 'timestamp' in session: init ()
    session['timestamp'] = datetime.now ()

    if app.session_cookie_name in request.cookies:
        session_cn = app.session_cookie_name
        session_id = request.cookies[session_cn] \
            .split ('?')[1].split ('&')[0].split ('=')[1]
    else:
        session_id = None

    if not request.args.get ('silent', False):
        print >> sys.stderr, "Session ID: %s" % session_id
        print >> sys.stderr, "Time Stamp: %s" % session['timestamp']

    if is_reset (): reset (json=False)
    if is_refresh (): refresh (session_id, json=False)

    #@cache.memoize (60, unless=is_dev)
    def cached_template (template, page, debug):

        ##
        ## TODO: The FlaskCache.memoize decorator is trouble on timeout; fix
        ##       with own decorator and put it to *WebedCache.memoize*!
        ##

        key = cache.make_key ('render_template', template, page, debug)
        val = cache.get (key)

        if not val:
            val = render_template (template, page=page, debug=debug)
            cache.set (key, val, timeout=15)

        return val

    return cached_template (template, page=page, debug=app.debug)

###############################################################################
###############################################################################

@page.route ('/reset/')
#@cache.memoize (15, unless=is_dev)
def reset (json=True):

    if is_dev ():
        name = request.args['name'] if 'name' in request.args else None
        mail = request.args['mail'] if 'mail' in request.args else None
        db_reset (name, mail); init ()
        result = dict (success=True)
    else:
        result = dict (success=False)

    return jsonify (result) if json else result

@page.route ('/refresh/')
#@cache.memoize (15, unless=is_dev)
def refresh (session_id=None, json=True):

    assert session_id or not session_id

    ##
    ## The parameter `session_id` is required for per session caching; other -
    ## wise a refresh would be globally cached, which is *not* desired here!
    ##

    db_refresh (); init ()
    result = dict (success=True)
    return jsonify (result) if json else result

###############################################################################
###############################################################################

def db_reset (name=None, mail=None):

    db.drop_all ()
    db.create_all ()

    user = User (
        name=name if name else u'admin',
        mail=mail if mail else u'admin@mail.net')

    db.session.add (user)
    db.session.commit ()

def db_refresh ():

    if 'root_uuid' in session:
        base = Q (Node.query).one_or_default (uuid=session['root_uuid'])
        if base:
            db.session.delete (base)
            db.session.commit ()

def init ():

    base = Node ('root', root=None, mime='application/root')
    db.session.add (base)
    db.session.commit ()

    init_article (root=base)
    init_report (root=base)

    leaf = Leaf ('author.txt', root=base, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)

    leaf = Leaf ('about.tiff', root=base, mime='image/tiff')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/tiff')
    db.session.add (prop)

    node = Node ('Archive', root=base, mime='application/project')
    db.session.add (node)
    for index in range (50):
        leaf = Leaf ('file-%03d.txt' % index, root=node, mime='text/plain')
        db.session.add (leaf)
        prop = TextProperty ('data', u'....', leaf, mime='text/plain')
        db.session.add (prop)

    db.session.commit ()

    ##
    ## Ensures that session is associated with a *new* base node; it's quite
    ## important since it provides the anchor for the rest of the application.
    ##

    session['root_uuid'] = base.uuid

def init_article (root):

    node = Node ('Article', root, mime='application/project')
    db.session.add (node)
    leaf = Leaf ('options.cfg', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)
    leaf = Leaf ('content.txt', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)

    node = Node ('resources', node, mime='application/folder')
    db.session.add (node)
    leaf = Leaf ('wiki.png', node, mime='image/png')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/png')
    db.session.add (prop)
    leaf = Leaf ('time.jpg', node, mime='image/jpg')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/jpg')
    db.session.add (prop)

def init_report (root):

    node = Node ('Report', root, mime='application/project')
    db.session.add (node)
    leaf = Leaf ('options.cfg', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)
    leaf = Leaf ('content.txt', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)

    node = Node ('resources', node, mime='application/folder')
    db.session.add (node)
    leaf = Leaf ('wiki.png', node, mime='image/png')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/png')
    db.session.add (prop)
    leaf = Leaf ('time.jpg', node, mime='image/jpg')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/jpg')
    db.session.add (prop)

###############################################################################
###############################################################################

app.register_blueprint (page)

###############################################################################
###############################################################################
