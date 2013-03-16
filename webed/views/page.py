
__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request, session
from flask import Blueprint

from ..app import app
from ..ext import cache
from ..session.anchor import SessionAnchor

import sys
import director

###############################################################################
###############################################################################

page = Blueprint ('page', __name__)

###############################################################################
###############################################################################

@page.route ('/test/')
def test ():
    return main (page='home', template='index-test.html')

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
        print >> sys.stderr, "Session: %r" % SessionAnchor (session)

    if 'reset' in request.args:
        director.reset (json=False)
    elif 'refresh' in request.args:
        director.refresh (json=False)
    else:
        director.setup (json=False)

    @cache.memoize (name='views.main.cached_template', unless=app.is_dev)
    def cached_template (template, page, debug, lazy):
        return render_template (template, page=page, debug=debug, lazy=lazy)

    debug = False if 'no-debug' in request.args else app.debug
    lazy = 'lazy' in request.args

    return cached_template (template, page=page, debug=debug, lazy=lazy)

###############################################################################
###############################################################################

app.register_blueprint (page)

###############################################################################
###############################################################################
