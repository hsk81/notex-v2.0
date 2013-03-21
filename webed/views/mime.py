__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint

from ..app import app
from ..ext import std_cache
from ..util import JSON

import re

###############################################################################
###############################################################################

mime = Blueprint ('mime', __name__)

###############################################################################
###############################################################################

def mimes ():

    return [{
        'name': 'APL',
        'mime': 'text/apl',
        'icon': 'icon-page_white_code',
        'exts': ['apl']
    }, {
        'name': 'Asterisk',
        'mime': 'text/x-asterisk',
        'icon': 'icon-page_white_code_red',
        'exts': ['conf']
    }, {
        'name': 'C',
        'mime': 'text/x-csrc',
        'icon': 'icon-page_white_c',
        'exts': ['c']
    }, {
        'name': 'C++',
        'mime': 'text/x-c++src',
        'icon': 'icon-page_white_cplusplus',
        'exts': ['cpp', 'cxx']
    }, {
        'name': 'Java',
        'mime': 'text/x-java',
        'icon': 'icon-page_white_cup',
        'exts': ['java']
    }, {
        'name': 'C#',
        'mime': 'text/x-csharp',
        'icon': 'icon-page_white_csharp',
        'exts': ['cs']
    }, {
        'name': 'Scala',
        'mime': 'text/x-scala',
        'icon': 'icon-page_white_code',
        'exts': ['scala']
    }, {
        'name': 'Clojure',
        'mime': 'text/x-clojure',
        'icon': 'icon-page_white_code',
        'exts': ['clj']
    }, {
        'name': 'CoffeeScript',
        'mime': 'text/x-coffeescript',
        'icon': 'icon-page_white_cup',
        'exts': ['coffee']
    }, {
        'name': 'Common Lisp',
        'mime': 'text/x-common-lisp',
        'icon': 'icon-page_white_code',
        'exts': ['lisp']
    }, {
        'name': 'CSS',
        'mime': 'text/css',
        'icon': 'icon-css',
        'exts': ['css']
    }, {
        'name': 'D',
        'mime': 'text/x-d',
        'icon': 'icon-page_white_code',
        'exts': ['d']
    }, {
        'name': 'Diff',
        'mime': 'text/x-diff',
        'icon': 'icon-document_inspect',
        'exts': ['diff']
    }, {
        'name': 'ECL',
        'mime': 'text/x-ecl',
        'icon': 'icon-page_white_code',
        'exts': ['ecl']
    }, {
        'name': 'Erlang',
        'mime': 'text/x-erlang',
        'icon': 'icon-page_white_code',
        'exts': ['erl']
    }, {
        'name': 'GO',
        'mime': 'text/x-go',
        'icon': 'icon-page_white_go',
        'exts': ['go']
    }, {
        'name': 'Groovy',
        'mime': 'text/x-groovy',
        'icon': 'icon-page_white_cup',
        'exts': ['groovy', 'gvy', 'gy', 'gsh']
    }, {
        'name': 'H',
        'mime': 'text/x-csrc',
        'icon': 'icon-page_white_h',
        'exts': ['h']
    }, {
        'name': 'Haskell',
        'mime': 'text/x-haskell',
        'icon': 'icon-page_white_code',
        'exts': ['hs', 'lhs']
    }, {
        'name': 'Haxe',
        'mime': 'text/x-haxe',
        'icon': 'icon-page_white_code',
        'exts': ['hx']
    }, {
        'name': 'ASP.NET',
        'mime': 'application/x-aspx',
        'icon': 'icon-page_white_world',
        'flag': {'text': True},
        'exts': ['aspx']
    }, {
        'name': 'Embedded Javascript',
        'mime': 'application/x-ejs',
        'icon': 'icon-page_white_world',
        'flag': {'text': True},
        'exts': ['ejs']
    }, {
        'name': 'JavaServer Pages',
        'mime': 'application/x-jsp',
        'icon': 'icon-page_white_world',
        'flag': {'text': True},
        'exts': ['jsp']
    }, {
        'name': 'HTML',
        'mime': 'text/html',
        'icon': 'icon-html',
        'exts': ['html']
    }, {
        'name': 'HTTP',
        'mime': 'message/http',
        'icon': 'icon-page_white_get',
        'flag': {'text': True},
        'exts': ['http']
    }, {
        'name': 'JavaScript',
        'mime': 'text/javascript',
        'icon': 'icon-page_white_cup',
        'exts': ['js']
    }, {
        'name': 'JSON',
        'mime': 'application/json',
        'icon': 'icon-page_white_code_red',
        'flag': {'text': True},
        'exts': ['json']
    }, {
        'name': 'TypeScript',
        'mime': 'application/typescript',
        'icon': 'icon-page_white_cup',
        'flag': {'text': True},
        'exts': ['ts']
    }, {
        'name': 'LESS',
        'mime': 'text/x-less',
        'icon': 'icon-css',
        'exts': ['less']
    }, {
        'name': 'Lua',
        'mime': 'text/x-lua',
        'icon': 'icon-page_white_code',
        'exts': ['lua']
    }, {
        'name': 'Markdown (GitHub-flavour)',
        'mime': 'text/x-markdown',
        'icon': 'icon-page',
        'flag': {'spell_check': True},
        'exts': ['md']
    }, {
        'name': 'NTriples',
        'mime': 'text/n-triples',
        'icon': 'icon-page_white_code_red',
        'exts': ['nt']
    }, {
        'name': 'OCaml',
        'mime': 'text/x-ocaml',
        'icon': 'icon-page_white_code',
        'exts': ['ocaml', 'mli', 'ml']
    }, {
        'name': 'Pascal',
        'mime': 'text/x-pascal',
        'icon': 'icon-page_white_code',
        'exts': ['pas', 'pascal', 'tpu']
    }, {
        'name': 'Perl',
        'mime': 'text/x-perl',
        'icon': 'icon-page_white_code',
        'exts': ['pl', 'perl', 'plx', 'pm']
    }, {
        'name': 'PHP',
        'mime': 'text/x-php',
        'icon': 'icon-page_white_php',
        'exts': ['php']
    }, {
        'name': 'Pig',
        'mime': 'text/x-pig',
        'icon': 'icon-page_white_database',
        'exts': ['pig']
    }, {
        'name': 'Plain Text',
        'mime': 'text/plain',
        'icon': 'icon-page_white_text',
        'flag': {'spell_check': True},
        'exts': ['txt']
    }, {
        'name': 'Properties files',
        'mime': 'text/x-properties',
        'icon': 'icon-page_white_code_red',
        'exts': ['properties']
    }, {
        'name': 'Python',
        'mime': 'text/x-python',
        'icon': 'icon-page_white_code',
        'exts': ['py']
    }, {
        'name': 'R',
        'mime': 'text/x-rsrc',
        'icon': 'icon-page_white_code',
        'exts': ['r']
    }, {
        'name': 'reStructuredText',
        'mime': 'text/x-rst',
        'icon': 'icon-page',
        'flag': {'spell_check': True, 'tbar': 'rest-toolbar'},
        'exts': ['rst', 'rest']
    }, {
        'name': 'Ruby',
        'mime': 'text/x-ruby',
        'icon': 'icon-page_white_ruby',
        'exts': ['rb', 'ruby']
    }, {
        'name': 'Rust',
        'mime': 'text/x-rustsrc',
        'icon': 'icon-page_white_code',
        'exts': ['rust']
    }, {
        'name': 'Sass',
        'mime': 'text/x-sass',
        'icon': 'icon-css',
        'exts': ['sass']
    }, {
        'name': 'Scheme',
        'mime': 'text/x-scheme',
        'icon': 'icon-page_white_code',
        'exts': ['scm', 'ss']
    }, {
        'name': 'Shell',
        'mime': 'text/x-sh',
        'icon': 'icon-page_white_code',
        'exts': ['sh', 'ksh', 'bsh']
    }, {
        'name': 'Sieve',
        'mime': 'application/sieve',
        'icon': 'icon-page_white_code',
        'flag': {'text': True},
        'exts': ['sieve']
    }, {
        'name': 'Smalltalk',
        'mime': 'text/x-stsrc',
        'icon': 'icon-page_white_code',
        'exts': ['st']
    }, {
        'name': 'SPARQL',
        'mime': 'application/x-sparql-query',
        'icon': 'icon-page_white_database',
        'flag': {'text': True},
        'exts': ['rq']
    }, {
        'name': 'SQL',
        'mime': 'text/x-mariadb',
        'icon': 'icon-page_white_database',
        'exts': ['sql']
    }, {
        'name': 'sTeX',
        'mime': 'text/x-stex',
        'icon': 'icon-page',
        'flag': {'spell_check': True},
        'exts': ['stex']
    }, {
        'name': 'LaTeX',
        'mime': 'text/x-latex',
        'icon': 'icon-page',
        'flag': {'spell_check': True},
        'exts': ['tex', 'lof', 'toc', 'sty', 'latex']
    }, {
        'name': 'TiddlyWiki ',
        'mime': 'text/x-tiddlywiki',
        'icon': 'icon-page',
        'flag': {'spell_check': True},
        'exts': ['wiki']
    }, {
        'name': 'Tiki wiki',
        'mime': 'text/tiki',
        'icon': 'icon-page',
        'flag': {'spell_check': True},
        'exts': ['tiki']
    }, {
        'name': 'VB.NET',
        'mime': 'text/x-vb',
        'icon': 'icon-page_white_code',
        'exts': ['vb']
    }, {
        'name': 'VBScript',
        'mime': 'text/vbscript',
        'icon': 'icon-page_white_code',
        'exts': ['vbs']
    }, {
        'name': 'Verilog',
        'mime': 'text/x-verilog',
        'icon': 'icon-page_white_code',
        'exts': ['v']
    }, {
        'name': 'XML',
        'mime': 'application/xml',
        'icon': 'icon-page_white_code_red',
        'flag': {'text': True},
        'exts': ['xml', 'xhtml']
    }, {
        'name': 'XQuery',
        'mime': 'application/xquery',
        'icon': 'icon-page_white_database',
        'flag': {'text': True},
        'exts': ['xq', 'xql', 'xqm', 'xqy', 'xquery', 'xqws']
    }, {
        'name': 'YAML',
        'mime': 'text/x-yaml',
        'icon': 'icon-page_white_code_red',
        'exts': ['yaml']
    }, {
        'name': 'Z80',
        'mime': 'text/x-z80',
        'icon': 'icon-page_white_code',
        'exts': ['z80']
    }, {
        'name': 'Root',
        'mime': 'application/root',
        'icon': 'icon-node_tree'
    }, {
        'name': 'Folder',
        'mime': 'application/folder',
        'icon': 'icon-folder'
    }, {
        'name': 'Default',
        'mime': 'application/project',
        'icon': 'icon-report',
        'main': 'text/plain'
    }, {
        'name': 'ReStructuredTex',
        'mime': 'application/project+rest',
        'icon': 'icon-report_rest',
        'main': 'text/x-rst'
    }, {
        'name': 'LaTex',
        'mime': 'application/project+latex',
        'icon': 'icon-report_latex',
        'main': 'text/x-latex'
    }, {
        'name': 'Text',
        'mime': 'text/*',
        'icon': 'icon-page'
    }, {
        'name': 'Image',
        'mime': 'image/*',
        'icon': 'icon-picture'
    }, {
        'name': 'Default',
        'mime': '*',
        'icon': 'icon-page_white'
    }]

###############################################################################
###############################################################################

@mime.route ('/mime-info', methods=['GET'])
@std_cache.memoize (900, name='views.mime-info')
def mime_info (mime=None, json=True):

    if not mime:
        results = mimes ()
    else:
        rx = re.compile ('^' + mime + '$')
        results = filter (lambda item: re.match (rx, item['mime']), mimes ())

    return JSON.encode (dict (results=results)) if json else results

###############################################################################
###############################################################################

rx_root = re.compile (r'^application/root$')
rx_project = re.compile (r'^application/project(?:\+\w+)?$')
rx_folder = re.compile (r'^application/folder$')

rx_text = re.compile (r'^text/[^*]+$')
rx_text_any = re.compile (r'^text/.+$')
rx_image = re.compile (r'^image/[^*]+$')
rx_image_any = re.compile (r'^image/.+$')

def is_root (mime):
    return re.match (rx_root, mime)

def is_project (mime):
    return re.match (rx_project, mime)

def is_folder (mime):
    return re.match (rx_folder, mime)

def is_text (mime, no_fallback=None):

    def match ():
        return re.match (rx_text, mime) if no_fallback else \
               re.match (rx_text_any, mime)

    if not match ():
        records = mime_info (mime, json=False)
        if len (records) > 0:
            record = records[0]
            if 'flag' in record:
                flag = record['flag']
                if flag and 'text' in flag and flag['text']:
                    return True

        return False
    return True

def is_image (mime, no_fallback=None):

    def match ():
        return re.match (rx_image, mime) if no_fallback else \
               re.match (rx_image_any, mime)

    if not match ():
        records = mime_info (mime, json=False)
        if len (records) > 0:
            record = records[0]
            if 'flag' in record:
                flag = record['flag']
                if flag and 'image' in flag and flag['image']:
                    return True

        return False
    return True

###############################################################################
###############################################################################

app.register_blueprint (mime)

###############################################################################
###############################################################################
