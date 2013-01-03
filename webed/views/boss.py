__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.globals import session
from flask import Blueprint

from ..app import app
from ..ext import cache
from ..util import jsonify
from ..session import SessionManager

from datetime import datetime

###############################################################################
###############################################################################

boss = Blueprint ('boss', __name__)

###############################################################################
###############################################################################

@boss.route ('/setup/')
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

@boss.route ('/refresh/')
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

@boss.route ('/reset/')
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

###############################################################################
###############################################################################

app.register_blueprint (boss)

###############################################################################
###############################################################################
