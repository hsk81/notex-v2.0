__author__ = 'hsk81'

###############################################################################
###############################################################################

import os
import socket

from ..util import in_rxs

###############################################################################
###############################################################################

class DefaultConfig:

    MACH_DEVS = [r'(.*)\.blackhan.ch$']
    DEBUG = os.environ['DEBUG'] == 'True' if 'DEBUG' in os.environ \
        else in_rxs (socket.getfqdn (), MACH_DEVS)

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/webed.db'

    LOG_FILE = '../webed.log'

    ##
    ## Debug Toolbar: Disables/enables the interception of redirection; since
    ## it can be quite annoying it has been disabled.
    ##

    DEBUG_TB_INTERCEPT_REDIRECTS = False

    ##
    ## Override secret key in production environment using value from the
    ## *production.py* file.
    ##

    SECRET_KEY = '000000000000000000000000000000000000000='

    ##
    ## If a set has more than LOADSKIP_LIMIT elements (sets plus docs), than
    ## they are *not* preloaded. For LOADSKIP_LIMIT = 0, the elements of any
    ## given set is loaded only on demand.
    ##

    LOADSKIP_LIMIT = 16

###############################################################################
###############################################################################
