__author__ = 'hsk81'

###############################################################################
###############################################################################

from datetime import timedelta
from ..util import in_rxs

import os
import socket

###############################################################################
###############################################################################

class DefaultConfig:

    MACH_DEVS = [r'(.*)\.blackhan.ch$']
    DEBUG = os.environ['DEBUG'] == 'True' if 'DEBUG' in os.environ \
        else bool (in_rxs (socket.getfqdn (), MACH_DEVS))

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = None ## override

    PERMANENT_SESSION_LIFETIME = timedelta (days=14) ## session expires after!
    CACHE_DEFAULT_TIMEOUT = int (PERMANENT_SESSION_LIFETIME.total_seconds ())

    CACHE0_KEY_PREFIX = 'webed-std:'
    CACHE0_SERVERS = ['127.0.0.1']
    CACHE1_KEY_PREFIX = 'webed-obj:'
    CACHE1_SERVERS = ['127.0.0.1']
    CACHE2_KEY_PREFIX = 'webed-sss:'
    CACHE2_SERVERS = ['127.0.0.1']
    CACHE3_KEY_PREFIX = 'webed-dbs:'
    CACHE3_SERVERS = ['127.0.0.1']

    LOG_FILE = os.path.join ('..', 'webed.logs', 'webed.log')
    YML_FILE = os.path.join ('webed', 'static', 'assets.yaml')

    ##
    ## Debug Toolbar: Disables/enables the interception of redirection; since
    ## it can be quite annoying it has been disabled.
    ##

    DEBUG_TB_INTERCEPT_REDIRECTS = False

    ##
    ## Override secret key in production environment to ensure security.
    ##

    SECRET_KEY = '000000000000000000000000000000000000000='

    ##
    ## PRIVILEGED_ADDRESSES is a list of IP addresses privileged actions can be
    ## executed from, i.e. admin views.
    ##

    PRIVILEGED_ADDRESSES = ['127.0.0.1']

    ##
    ## MIMETYPE_PATHs is a list of paths point to a `mime.types` file, which
    ## stores *user defined* mime to file extensions combinations.
    ##

    MIMETYPES_PATHS = ['/etc/mime.types', './mime.types']

    ##
    ## TYPO_PATH is the path to the `typojs` sub-module, and TYPO_DICT_PATH
    ## leads to the `hunspell` dictionaries.
    ##

    TYPO_PATH = os.path.join ('webed', 'static', 'lib', 'typojs')
    TYPO_DICT_PATH = os.path.join (TYPO_PATH, 'typo', 'dictionaries')

    ##
    ## At session setup data is required: ARCHIVE_PATH is the path to the
    ## archives, which will be imported on the first visit.
    ##

    ARCHIVE_PATH = os.path.join ('webed', 'static', 'webed-ext', 'dat')
    ARCHIVE_INCLUDE = [r'(.+)\.zip$']
    ARCHIVE_EXCLUDE = [r'^_', r'^\.']

    ##
    ## FS_ROOT is the root path for the file system backend, whereas FS_DATA
    ## point to the data part of it.
    ##

    FS_ROOT = os.path.join (os.path.sep, 'var', 'www', 'webed')
    FS_DATA = os.path.join (FS_ROOT, 'data')
    FS_ACID = os.path.join (FS_ROOT, 'acid')

    ##
    ## DEFAULT_MAIL_RECEIVERS should filled with those receivers' emails, who
    ## are in charge of processing feedback mails.
    ##

    DEFAULT_MAIL_RECEIVERS = []

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

    ##
    ## BLOG_ID, BLOG_URL, BLOG_API_KEY and BLOG_URL should be overridden in
    ## production environment with proper values.
    ##

    BLOG_ID = None
    BLOG_URL = None
    BLOG_API_KEY = None
    BLOG_HEADERS = None

    ##
    ## FORUM_URL points to an *external* address where the builtin board system
    ## has been setup.
    ##

    FORUM_URL = None

    ##
    ## Override MAIL settings in production environment with proper values.
    ##

    MAIL_SERVER = None
    MAIL_PORT = None
    MAIL_USE_TLS = None
    MAIL_USERNAME = None
    MAIL_PASSWORD = None

    DEFAULT_MAIL_SENDER = ('sender', 'mail@address.net')
    DEFAULT_MAIL_RECEIVERS = []

    ##
    ## ADSENSE controls if the application should displays advertisement from
    ## Google's ad network.
    ##

    ADSENSE = False

    ##
    ## Override CDN settings in production environment with proper value.
    ##

    CDN = None

###############################################################################
###############################################################################
