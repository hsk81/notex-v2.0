__author__ = 'hsk81'

################################################################################
################################################################################

import os
import yaml
import types
import interpolator

################################################################################
################################################################################

def yaml2py (yaml_path, path_to, filename='conf.py'):

    constructor = lambda loader, node: loader.construct_pairs (node)
    yaml.SafeLoader.add_constructor ('!omap', constructor)

    with open (yaml_path, 'r') as source: text = source.read ()
    data = yaml.load ('!omap\n' + text, Loader=yaml.SafeLoader)

    umap = dict (data)
    if not umap.has_key ('latex_backend'):
        umap['latex_backend'] = 'pdflatex' # default

    if umap['latex_backend'] != 'pdflatex' and \
       umap['latex_backend'] != 'xelatex':
        umap['latex_backend'] = 'pdflatex' # security: validation!

    with open (os.path.join (path_to, filename), 'w+') as target:

        target.write ("# -*- coding: utf-8 -*-\n")
        target.write ("extensions = ['%s','%s','%s']\n" % (
            'sphinx.ext.ifconfig', 'sphinx.ext.todo', 'sphinx.ext.mathjax'
        ))

        for key, value in data:

            if key == 'extensions': # security: pre-defined!
                continue

            if key == 'latex_elements' and umap['latex_backend'] == 'xelatex':
                value['inputenc'] = \
                    '\\\\newcommand{\\\\DeclareUnicodeCharacter}[2]{}'
                value['fontenc'] = \
                    '\\\\usepackage{xltxtra}'

            target.write (
                '%s\n' % emit (value, type (value), key).encode ("utf-8"))

    return umap['latex_backend']

################################################################################

def emit (value, vtype, key=None):

    if   vtype == types.ListType: return emit_list (value, key)
    elif vtype == types.DictType: return emit_dict (value, key)
    elif vtype == types.IntType: return emit_number (value, key)
    elif vtype == types.FloatType: return emit_number (value, key)
    elif vtype == types.StringType: return emit_string (value, key)
    elif vtype == types.UnicodeType: return emit_string (value, key)
    elif vtype == types.NoneType: return emit_none (key)

    else: return emit_none (key) ## security: ignore other types!

def emit_list (ls, key):

    if key:
        return '%s = [%s]' % (key, ','.join (
            map (lambda el: emit (el, type (el)), ls)))
    else:
        return '[%s]' % ','.join (
            map (lambda el: emit (el, type (el)), ls))

def emit_dict (ds, key):

    if key: return '%s = {%s}' % (key, ','.join (
        '"%s":%s' % (k, emit (ds[k], type (ds[k]))) for k in ds))
    else: return '{%s}' % ','.join (
        '"%s":%s' % (k, emit (ds[k], type (ds[k]))) for k in ds)

def emit_number (value, key):

    if key:
        return '%s = %s"' % (key, value)
    else:
        return      '%s' % value

def emit_string (value, key):

    if key:
        return '%s = u"""%s"""' % (key, interpolator.apply (value, key))
    else:
        return      'u"""%s"""' % interpolator.apply (value, None)

def emit_none (key):

    if key:
        return '%s = u""' % key
    else:
        return      'u""'

################################################################################
################################################################################
