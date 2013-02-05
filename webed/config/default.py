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
        else bool (in_rxs (socket.getfqdn (), MACH_DEVS))

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = None

    CACHE_DEFAULT_TIMEOUT = 3600 * 72 ## 3d
    CACHE_DEFAULT_KEY_PREFIX = 'webed:'
    CACHE_DEFAULT_SERVERS = ['127.0.0.1']

    CACHE0_KEY_PREFIX = 'webed:'
    CACHE0_SERVERS = ['127.0.0.1']
    CACHE1_KEY_PREFIX = 'webed-obj:'
    CACHE1_SERVERS = ['127.0.0.1']

    LOG_FILE = os.path.join ('..', 'webed.log')

    ##
    ## DEFAULT_MAIL_RECEIVERS should filled with those receivers' emails, who
    ## are in charge of processing feedback mails.
    ##

    DEFAULT_MAIL_RECEIVERS = []

    ##
    ## At session setup data is required: ARCHIVE_PATH is the path to the
    ## archives, which will be imported on the first visit.
    ##

    ARCHIVE_PATH = os.path.join ('webed', 'static', 'dat')
    ARCHIVE_INCLUDE = [r'(.+)\.zip$']
    ARCHIVE_EXCLUDE = [r'^_', r'^\.']

    ##
    ## FS_ROOT is the root path for the file system backend, whereas FS_DATA
    ## point to the data part of it.
    ##

    FS_ROOT = os.path.join (os.path.sep, 'var', 'lib', 'webed')
    FS_DATA = os.path.join (FS_ROOT, 'data')

    ##
    ## Debug Toolbar: Disables/enables the interception of redirection; since
    ## it can be quite annoying it has been disabled.
    ##

    DEBUG_TB_INTERCEPT_REDIRECTS = False

    ##
    ## Override secret key in production environment using value from the
    ## *production.py* file to ensure proper security.
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

    MAX_NODE_LEVEL = 2

    ##
    ## Limits the max. payload to MAX_CONTENT_LENGTH bytes. If a larger file is
    ## transmitted, an `RequestEntityTooLarge` exception will be raised.
    ##

    MAX_CONTENT_LENGTH = 1 * 1024 * 1024 ## 1MB

###############################################################################
###############################################################################
