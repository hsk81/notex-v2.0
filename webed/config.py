__author__ = 'hsk81'

###############################################################################
###############################################################################

import os
import util
import socket

###############################################################################
###############################################################################

class DefaultConfig:

    MACH_DEVS = [r'(.*)\.blackhan.ch$']
    DEBUG = os.environ['DEBUG'] == 'True' if 'DEBUG' in os.environ \
        else util.in_rxs (socket.getfqdn (), MACH_DEVS)

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/webed.db'

    ##
    ## If a set has more than LOADSKIP_LIMIT elements (sets plus docs), than
    ## they are *not* preloaded. For LOADSKIP_LIMIT = 0, the elements of any
    ## given set is loaded only on demand.
    ##

    LOADSKIP_LIMIT = 16

class TestConfig (DefaultConfig):

    DEBUG = False
    TESTING = True

    CSRF_ENABLED = False

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = 'sqlite://'

###############################################################################
###############################################################################
