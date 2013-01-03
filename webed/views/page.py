__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request, session
from flask import Blueprint

from ..app import app
from ..ext import cache

import sys
import session_manager

###############################################################################
###############################################################################

page = Blueprint ('page', __name__)

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

@page.route ('/test/')
def test ():
    return main (page='home', template='index_test.html')

@page.route ('/')
def main (page='home', template='index.html'):

    if not request.args.get ('silent', False):
        print >> sys.stderr, "Session ID: %r" % session['_id']

    if 'reset' in request.args:
        session_manager.reset (json=False)
    elif 'refresh' in request.args:
        session_manager.refresh (json=False)
    else:
        session_manager.setup (json=False)

    @cache.memoize (name='views.main.cached_template', unless=app.is_dev)
    def cached_template (template, page, debug):
        return render_template (template, page=page, debug=debug)

    return cached_template (template, page=page, debug=app.debug)

###############################################################################
###############################################################################

app.register_blueprint (page)

###############################################################################
###############################################################################
