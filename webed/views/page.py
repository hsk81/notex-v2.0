
__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.templating import render_template
from flask.globals import request, session
from flask import Blueprint, url_for

from ..app import app
from ..ext import std_cache
from ..session.anchor import SessionAnchor

import re
import sys
import setup
import director
import requests as req

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

@page.route ('/rest/')
def rest (): return main (page='rest')

@page.route ('/faq/')
def faq (): return main (page='faq')

@page.route ('/blog/')
def blog ():

    url = app.config['BLOG_URL']
    api_key = app.config.get ('BLOG_API_KEY')
    headers = app.config['BLOG_HEADERS']

    res = req.get (url, params=dict(key=api_key), headers=headers)
    blog = res.json () if res.ok else dict (items=[])

    return main (page='blog', blog=blog)

@page.route ('/contact/')
def contact (): return main (page='contact')

@page.route ('/')
def main (page='main', template='index.html', **kwargs):

    if not request.args.get ('silent', False):
        print >> sys.stderr, "Session: %r" % SessionAnchor (session)

    if 'reset' in request.args:
        director.reset (json=False)
    elif 'refresh' in request.args:
        director.refresh (json=False)

    @std_cache.memoize (900, name='views.main.cached_template', unless=app.is_dev)
    def cached_template (*args, **kwargs):
        return render_template (*args, **kwargs)

    canonical = get_canonical (page)
    debug = False if 'no-debug' in request.args else app.debug
    title = get_title (page)
    description = get_description (page)
    keywords = get_keywords (page)
    theme = request.args.get ('theme', 'blue')
    version = '.'.join (setup.version.split ('.')[:2])

    return cached_template (template, debug=debug, keywords=keywords,
        title=title, description=description, canonical=canonical, page=page,
        theme=theme, version=version, **kwargs)

###############################################################################
###############################################################################

def get_keywords (page):

    common = ['reStructuredText', 'Markdown', 'LaTex', 'article', 'report',
              'thesis', 'book', 'editor', 'restructured', 'text', 'pdf',
              'html', 'converter', 'sphinx']

    lookup = {
        'home':
            common + ['home'],
        'overview':
            common + ['overview', 'introduction', 'background', 'information'],
        'tutorial':
            common + ['tutorial', 'guide', 'user interface', 'first', 'report',
                      'project'],
        'rest':
            common + ['ReST', 'rST', 'primer', 'tutorial', 'markup',
                      'language'],
        'faq':
            common + ['faq', 'frequently asked', 'important', 'questions'],
        'blog':
            common + ['blog', 'information', 'development'],
        'contact':
            common + ['contact', 'form', 'e-mail', 'feedback', 'questions'],
    }

    lookup['main'] = lookup['home']
    return lookup[page]

###############################################################################
###############################################################################

def get_title (page):

    lookup = {
        'home':
            """
            NoTex - A browser based text editor supporting reStructuredText,
            Markdown, LaTex and more! Export your projects to PDF reports,
            HTML pages or LaTex scripts.
            """,
        'overview':
            """
            Overview - NoTex: An introduction to the editor plus motivation
            for reStructuredText (and other markups).
            """,
        'tutorial':
            """
            Tutorial - NoTex: A step by step guide explaining the editor's
            user interface and how to create your first project.
            """,
        'rest':
            """
            ReStructuredText - NoTex: A primer about reStructuredText.
            """,
        'faq':
            """
            FAQ - NoTex: Frequently asked and important questions about
            security, data, performance, documentation etc.
            """,
        'blog':
            """
            Blog - NoTex: Get additional information and documentation plus
            follow the development process.
            """,
        'contact':
            """
            Contact - NoTex: For questions and feedback contact us using our
            form or e-mail address.
            """,
    }

    lookup['main'] = lookup['home']
    return re.sub (r'\s+$', '', re.sub (r'^\s+', '', lookup[page], flags=re.M)
        .replace ('\n', ' '))

###############################################################################
###############################################################################

def get_description (page):

    lookup = {
        'home':
            """
            NoTex enables to write books, reports, articles and theses using
            the reStructuredText markup language and converts them to LaTex,
            PDF or HTML. The PDF files are of high publication quality and
            are produced via Sphinx with the Texlive LaTex suite.
            """,
        'overview':
            """
            An overview of word processing systems comparing them w.r.t. to
            the content versus presentation separation: Word and LaTex are
            shown to mix content and presentation (Word on a visual and
            LaTex on a markup level) and then an argument in favor of
            reStructuredText is made, which cleanly separates the content
            and presentation domains.
            """,
        'tutorial':
            """
            A tutorial about user interface of NoTex, explaining the various
            elements like project manager, menu, editor, main toolbar and
            status bar. It provides a brief step-by-step guide explaining
            how a novice user can create his first report and convert it to
            a PDF file.
            """,
        'rest':
            """
            A primer on the reStructuredText markup language, explaining
            the most important elements of it. The following elements are
            mentioned: paragraphs, inline markup, lists and quote-like
            blocks, source code, tables, hyperlinks, sections, explicit
            markup, directives, images, footnotes, citations, substitutions
            and comments.
            """,
        'faq':
            """
            A list of frequently asked or important question with their
            answers. The list covers topics about security, data,
            performance and documentation plus miscellaneous subjects like
            licencing, technology and contact information.
            """,
        'blog':
            """
            The NoTex blog provides additional information about the editor,
            is a rich source of documentation, and allows the users to follow
            the development process.
            """,
        'contact':
            """
            Contact information regarding the company behind; plus provides a
            form to directly send questions or feedback.
            """,
    }

    lookup['main'] = lookup['home']
    return re.sub (r'\s+$', '', re.sub (r'^\s+', '', lookup[page], flags=re.M)
        .replace ('\n', ' '))

###############################################################################
###############################################################################

def get_canonical (page):

    return url_for ('.main', _external=True) if page == 'home' \
        else request.base_url

###############################################################################
###############################################################################

app.register_blueprint (page)

###############################################################################
###############################################################################
