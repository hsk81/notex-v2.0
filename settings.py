# coding=utf-8

###############################################################################
###############################################################################

import os
SITE_ROOT = os.path.realpath (os.path.dirname (__file__))
SITE_NAME = 'webed'
SITE_HOST = 'blackhan.ch'

import socket
DEBUG = socket.gethostname () != SITE_HOST

if not DEBUG:
    SERVER_NAME = '%s.%s' % (SITE_NAME, SITE_HOST)

import base64
SECRET_KEY = base64.encodestring (os.urandom (24))
SQLALCHEMY_DATABASE_URI = 'sqlite:///%s/%s.db' % (SITE_ROOT, SITE_NAME)


##
## If a set has more than LOADSKIP_LIMIT elements (sets plus docs), than they
## are *not* preloaded. For LOADSKIP_LIMIT = 0, the elements of any given set
## is loaded only on demand.
##

LOADSKIP_LIMIT = 0

###############################################################################
###############################################################################
