__author__ = 'hsk81'

###############################################################################
###############################################################################

from webed.config import DefaultConfig
import os

###############################################################################
###############################################################################

class TestConfig (DefaultConfig):

    DEBUG = eval (os.getenv ('DEBUG', str (False)))
    TESTING = eval (os.getenv ('TESTING', str (True)))
    CSRF_ENABLED = eval (os.getenv ('CSRF_ENABLED', str (False)))

    SQLALCHEMY_ECHO = eval (os.getenv ('SQLALCHEMY_ECHO', str (False)))
    SQLALCHEMY_DATABASE_URI = os.getenv ('SQLALCHEMY_DATABASE_URI',
        'postgresql://webed-t@localhost/webed-t')

###############################################################################
###############################################################################
