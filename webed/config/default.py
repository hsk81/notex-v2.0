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
    ## If a node has more than MAX_NODE_SIZE **immediate** sub-nodes (nodes and
    ## leafs), then their sub-nodes are *not* preloaded. For MAX_NODE_SIZE = 0,
    ## the sub-nodes of any given node is loaded only on demand.
    ##

    MAX_NODE_SIZE = 16

    ##
    ## If the height of a tree below a given node is larger than MAX_NODE_LEVEL
    ## then the sub-nodes of the next layer are *not* preloaded. This means, if
    ## MAX_NODE_LEVEL = 0, then the sub-nodes are only loaded on demand.
    ##

    MAX_NODE_LEVEL = 0

###############################################################################
###############################################################################
