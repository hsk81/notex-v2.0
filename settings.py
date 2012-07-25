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

###############################################################################
###############################################################################
