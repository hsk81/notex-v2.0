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

SQLALCHEMY_DATABASE_URI = 'sqlite:///%s/%s.db' % (SITE_ROOT, SITE_NAME)
SECRET_KEY = os.urandom (24)

###############################################################################
###############################################################################
