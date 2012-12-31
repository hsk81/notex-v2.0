__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request
from flask import Blueprint, session

from datetime import datetime

from ..app import app
from ..ext import db, cache
from ..util import jsonify
from ..util.anchor import Anchor

from ..models import Node, Leaf
from ..models import TextProperty, LargeBinaryProperty

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
def main (page='home', template='index.html'):

    if not request.args.get ('silent', False):
        print >> sys.stderr, "Session ID: %r" % session['_id']

    if is_reset (): reset (json=False)
    if is_refresh (): refresh (json=False)

    init_session ()

    @cache.memoize (name='views.main.cached_template', unless=is_dev)
    def cached_template (template, page, debug):
        return render_template (template, page=page, debug=debug)

    return cached_template (template, page=page, debug=app.debug)

###############################################################################
###############################################################################

@page.route ('/reset/')
@cache.memoize (900, name='views.reset', unless=is_dev)
def reset (json=True):
    """
    Resets the database and is therefore a very dangerous function; so it's
    protected by an authentication mechanism plus it's only effective once
    every 15 minutes.
    """
    if is_dev (): ## TODO: Replace with authentication!
        Anchor (session).reset ()

    result = dict (success=True, timestamp=datetime.now ())
    return jsonify (result) if json else result

@page.route ('/refresh/')
@cache.memoize (900, name='views.refresh', session=session, unless=is_dev)
def refresh (json=True):
    """
    Resets the session: If a particular user wants to get rid of her own data
    and initialize the application to a clean state then this function should
    be called. To avoid misuse it's effective only once every 15 minutes.
    """
    Anchor (session).refresh ()
    result = dict (success=True, timestamp=datetime.now ())
    return jsonify (result) if json else result

###############################################################################
###############################################################################

def init_session ():

    if Anchor (session).initiated:
        return ## cache hit!

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

    Anchor (session).set_value (base.uuid)

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
