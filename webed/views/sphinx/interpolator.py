#!/usr/bin/env python
# -*- coding: utf-8 -*-

################################################################################
################################################################################

__author__ = "hsk81"

################################################################################
################################################################################

from datetime import datetime

import re
import urllib

################################################################################
################################################################################

class Interpolator (object):

    def __init__ (self, strict = True):

        self._predef_tbl = {
            'datetime': lambda *xs: xs and datetime.now ()
                .strftime (' '.join (xs)) or str (datetime.now ()),
            'date': lambda *xs: xs and datetime.now ().date ()
                .strftime (' '.join (xs)) or str (datetime.now ().date ()),
            'time': lambda *xs: xs and datetime.now ().time ()
                .strftime (' '.join (xs)) or str (datetime.now ().time ()),
        }

        self._filter_tbl = {
            'quote': lambda value, *args:
                urllib.quote_plus (value),
            'swap': lambda value, lhs, rhs, *args:
                value.replace (lhs, rhs)
        }

        self._lookup_tbl = {}
        self._strict = strict

    def apply (self, value, key=None, strict=None):
        """
        >>> self.apply ("άλφα", "alpha")
        '\\xce\\xac\\xce\\xbb\\xcf\\x86\\xce\\xb1'
        >>> self.apply ("${alpha}")
        '\\xce\\xac\\xce\\xbb\\xcf\\x86\\xce\\xb1'
        >>> print self.apply ("άλφα", "alpha")
        άλφα
        >>> print self.apply ("${alpha}")
        άλφα
        >>> self.apply ("α & β", "albe")
        '\\xce\\xb1 & \\xce\\xb2'
        >>> self.apply ("${albe|quote}")
        '%CE%B1+%26+%CE%B2'
        >>> self.apply ("${albe|swap α a|swap β b|swap & -|quote}")
        'a+-+b'

        >>> self.apply ("lorem ipsum", "tag")
        'lorem ipsum'
        >>> self.apply ("${tag}")
        'lorem ipsum'

        >>> self.apply ("${not-defined}")
        Traceback (most recent call last):
        UnknownTemplateError: ${not-defined}
        >>> self.apply ("${tag|not-defined}")
        Traceback (most recent call last):
        UnknownFilterError: not-defined

        >>> self.apply ("${tag|quote}")
        'lorem+ipsum'
        >>> self.apply ("${tag|quote|swap + -}")
        'lorem-ipsum'
        >>> self.apply ("${tag|swap ' ' +}", "tag")
        'lorem+ipsum'
        >>> self.apply ("${tag|swap + ' '}")
        'lorem ipsum'

        >>> self.apply ("lorem|ipsum", "tag")
        'lorem|ipsum'
        >>> self.apply ("${tag|swap \| &}", "tag")
        'lorem&ipsum'
        >>> self.apply ("${tag}|${tag}")
        'lorem&ipsum|lorem&ipsum'
        """

        for head, rest in re.findall ("\${([^|}]+)\|?(.*?)}", value):

            if rest != '':
                tpl = '${%s|%s}' % (head, rest)
            else:
                tpl = '${%s}' % head

            tag, ps = self._parse (head)

            filters = re.split (r"(?<!\\)\|", rest)
            filters = filter (lambda el: len (el) > 0, filters)
            filters = map (lambda el: el.replace ('\\|', '|'), filters)

            if self._lookup_tbl.has_key (tag):
                value = value.replace (tpl, self._filter (
                    self._lookup (tag, ps), filters, **{'strict': strict}))
            elif self._predef_tbl.has_key (tag):
                value = value.replace (tpl, self._filter (
                    self._predef (tag, ps), filters, **{'strict': strict}))

            elif (strict is not None) and strict:
                raise UnknownTemplateError (tpl)
            elif (strict is None) and self._strict:
                raise UnknownTemplateError (tpl)

        if key:
            self._lookup_tbl[key] = value

        return value

    def _lookup (self, key, ps):
        return self._lookup_tbl[key]

    def _predef (self, key, ps):
        return self._predef_tbl[key] (*ps)

    def _filter (self, value, filters, strict=None):

        for el in filters:

            op, ps = self._parse (el)

            if self._filter_tbl.has_key (op):
                value = self._filter_tbl[op] (value, *ps)
            elif strict is not None and strict:
                raise UnknownFilterError (op)
            elif strict is None and self._strict:
                raise UnknownFilterError (op)

        return value

    def _parse (self, cmd):
        """
        Multiple consecutive quote pairs of the same type cause the parser to
        report the whitespace *between* the quote pairs, instead of ignoring
        them. TODO: fix!

        * Expectation:
        >>> self._parse ('''swap "+" "-"''') # doctest: +SKIP
        ('swap', ['+', '-'])
        * But actual implementation:
        >>> self._parse ('''swap "+" "-"''')
        ('swap', ['+', ' ', '-'])

        * But these are fine:
        >>> self._parse ('''swap  +   - ''')
        ('swap', ['+', '-'])
        >>> self._parse ('''swap  +  "-"''')
        ('swap', ['+', '-'])
        >>> self._parse ('''swap "+"  - ''')
        ('swap', ['+', '-'])
        """
        ls = re.findall (r"""([^\s'"]+)|"(\s+)"|'(\s+)'""", cmd)
        ts = reduce (lambda rhs, lhs: rhs + lhs, ls, ())
        ps = list (filter (lambda el: len (el) > 0, ts))

        return ps.pop (0), ps

    def clear (self, key=None):
        """
        >>> self.clear ("tag")
        >>> self.clear ()
        """
        if key:
            self._lookup_tbl.pop (key, None)
        else:
            self._lookup_tbl.clear ()

    def add_predef (self, key, fn):
        """
        >>> self.add_predef ("none", None)
        Traceback (most recent call last):
        NoFunctionError: None
        >>> self.add_predef ("none", lambda x,*xs: None)
        """
        if callable (fn):
            self._predef_tbl[key] = fn
        else:
            raise NoFunctionError (fn)

    def del_predef (self, key):
        """
        >>> self.add_predef ("none", lambda x,*xs: None)
        >>> self.del_predef ("none")
        >>> self.del_predef ("none")
        """
        self._predef_tbl.pop (key, None)

    def add_filter (self, key, fn):
        """
        >>> self.add_filter ("none", None)
        Traceback (most recent call last):
        NoFunctionError: None
        >>> self.add_filter ("none", lambda x,*xs: None)
        """
        if callable (fn):
            self._filter_tbl[key] = fn
        else:
            raise NoFunctionError (fn)

    def del_filter (self, key):
        """
        >>> self.add_filter ("none", lambda x,*xs: None)
        >>> self.del_filter ("none")
        >>> self.del_filter ("none")
        """
        self._filter_tbl.pop (key, None)

################################################################################
################################################################################

class UnknownTemplateError (Exception): pass
class UnknownFilterError (Exception): pass
class NoFunctionError (Exception): pass

################################################################################
################################################################################

def apply (value, key=None, strict=None):
    return _interpolator.apply (value, key, strict)
def clear (key=None):
    return _interpolator.clear (key)
def add_predef (key, fn):
    return _interpolator.add_predef (key, fn)
def del_predef (key):
    return _interpolator.del_predef (key)
def add_filter (key, fn):
    return _interpolator.add_filter (key, fn)
def del_filter (key):
    return _interpolator.del_filter (key)

_interpolator = Interpolator ()

################################################################################
################################################################################

if __name__ == "__main__":

    import doctest
    doctest.testmod (extraglobs={'self': Interpolator ()})

################################################################################
################################################################################
