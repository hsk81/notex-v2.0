__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.globals import session
from flask import Blueprint

from ..ext import db
from ..app import app
from ..ext import cache
from ..util import jsonify
from ..util.anchor import Anchor
from ..models import Node, Leaf
from ..models import TextProperty, LargeBinaryProperty

from datetime import datetime

###############################################################################
###############################################################################

session_manager = Blueprint ('session_manager', __name__)

###############################################################################
###############################################################################

@session_manager.route ('/reset/')
@cache.memoize (900, name='views.reset', unless=app.is_dev)
def reset (json=True):
    """
    Resets the database and is therefore a very dangerous function; so it's
    protected by an authentication mechanism plus it's only effective once
    every 15 minutes (globally)!
    """
    session_manager = SessionManager (session)
    if session_manager.authenticated: session_manager.reset ()
    result = dict (success=True, timestamp=datetime.now ())
    return jsonify (result) if json else result

@session_manager.route ('/refresh/')
@cache.memoize (900, name='views.refresh', session=session, unless=app.is_dev)
def refresh (json=True):
    """
    Resets the session: If a particular user wants to get rid of her own data
    and initialize the application to a clean state then this function should
    be called. To avoid misuse it's effective once per 15 min (per session)!
    """
    SessionManager (session).refresh ()
    result = dict (success=True, timestamp=datetime.now ())
    return jsonify (result) if json else result

@session_manager.route ('/setup/')
@cache.memoize (900, name='views.setup', session=session, unless=app.is_dev)
def setup (json=True):
    """
    Sets a session up if it's virgin; otherwise no extra operation is executed.
    To avoid misuse - in addition to the virginity check - it's effective only
    once per 15 min (per session).
    """
    session_manager = SessionManager (session)
    if session_manager.virgin:
        session_manager.setup ()
        result = dict (success=True, timestamp=datetime.now ())
    else:
        result = dict (success=False, timestamp=datetime.now ())

    return jsonify (result) if json else result

###############################################################################
###############################################################################

class SessionManager:

    def __init__ (self, session):
        self.session = session

    def setup (self):
        base_uuid = setup_session (); assert base_uuid
        Anchor (session).set_value (base_uuid)

    def reset (self):
        Anchor (session).reset ()
        self.setup ()

    def refresh (self, json=True):
        base_uuid = Anchor (session).refresh ()
        if base_uuid: self.cleanup (base_uuid)
        self.setup ()

        result = dict (success=True, timestamp=datetime.now ())
        return jsonify (result) if json else result

    def cleanup (self, base_uuid):
        """
        TODO: Queue delete task using a distributed task queue!
        """
        assert base_uuid
    ##  base = Q (Node.query).one_or_default (uuid=base_uuid)
    ##  if base: db.session.delete (base); db.session.commit ()

    @property
    def authenticated (self):
        """
        TODO: Implement proper authentication mechanism based on admin login!
        """
        return app.is_dev ()

    @property
    def virgin (self):
        return not Anchor (session).initialized

###############################################################################
###############################################################################

def setup_session ():

    base = Node ('root', root=None, mime='application/root')
    db.session.add (base)
    db.session.commit ()

    setup_article (root=base)
    setup_report (root=base)

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
    return base.uuid

def setup_article (root):

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

def setup_report (root):

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

app.register_blueprint (session_manager)

###############################################################################
###############################################################################
