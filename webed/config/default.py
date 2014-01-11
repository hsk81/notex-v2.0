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

    MACH_DEVS = eval (os.getenv ('MACH_DEVS', str ([r'(.*)\.blackhan.ch$'])))
    DEBUG = os.environ['DEBUG'] == 'True' if 'DEBUG' in os.environ \
        else bool (in_rxs (socket.getfqdn (), MACH_DEVS))

    SQLALCHEMY_ECHO = eval (os.getenv ('SQLALCHEMY_ECHO', str (False)))
    SQLALCHEMY_DATABASE_URI = os.getenv ('SQLALCHEMY_DATABASE_URI', None)

    PERMANENT_SESSION_LIFETIME = eval (os.getenv (
        'PERMANENT_SESSION_LIFETIME', 'timedelta (days=14)'))
    CACHE_DEFAULT_TIMEOUT = int (os.getenv (
        'CACHE_DEFAULT_TIMEOUT', PERMANENT_SESSION_LIFETIME.total_seconds ()))

    CACHE0_KEY_PREFIX = os.getenv ('CACHE0_KEY_PREFIX', 'webed-std:')
    CACHE0_SERVERS = eval (os.getenv ('CACHE0_SERVERS', str (['127.0.0.1'])))
    CACHE1_KEY_PREFIX = os.getenv ('CACHE1_KEY_PREFIX', 'webed-obj:')
    CACHE1_SERVERS = eval (os.getenv ('CACHE1_SERVERS', str (['127.0.0.1'])))
    CACHE2_KEY_PREFIX = os.getenv ('CACHE2_KEY_PREFIX', 'webed-sss:')
    CACHE2_SERVERS = eval (os.getenv ('CACHE2_SERVERS', str (['127.0.0.1'])))
    CACHE3_KEY_PREFIX = os.getenv ('CACHE3_KEY_PREFIX', 'webed-dbs:')
    CACHE3_SERVERS = eval (os.getenv ('CACHE3_SERVERS', str (['127.0.0.1'])))

    LOG_FILE = os.path.join ('..', 'webed.logs', 'webed.log')
    LOG_FILE = os.getenv ('LOG_FILE', LOG_FILE)
    YML_FILE = os.path.join ('webed', 'static', 'assets.yaml')
    YML_FILE = os.getenv ('YML_FILE', YML_FILE)

    ##
    ## Debug Toolbar: Disables/enables the interception of redirection; since
    ## it can be quite annoying it has been disabled.
    ##

    DEBUG_TB_INTERCEPT_REDIRECTS = eval (os.getenv (
        'DEBUG_TB_INTERCEPT_REDIRECTS', str (False)))

    ##
    ## Override secret key in production environment to ensure security.
    ##

    SECRET_KEY = '000000000000000000000000000000000000000='
    SECRET_KEY = os.getenv ('SECRET_KEY', SECRET_KEY)

    ##
    ## PRIVILEGED_ADDRESSES is a list of IP addresses privileged actions can be
    ## executed from, i.e. admin views.
    ##

    PRIVILEGED_ADDRESSES = eval (os.getenv (
        'PRIVILEGED_ADDRESSES', str (['127.0.0.1'])))

    ##
    ## MIMETYPE_PATHs is a list of paths point to a `mime.types` file, which
    ## stores *user defined* mime to file extensions combinations.
    ##

    MIMETYPES_PATHS = ['/etc/mime.types', './mime.types']
    MIMETYPES_PATHS = eval (os.getenv (
        'MIMETYPES_PATHS', str (MIMETYPES_PATHS)))

    ##
    ## TYPO_PATH is the path to the `typojs` sub-module, and TYPO_DICT_PATH
    ## leads to the `hunspell` dictionaries.
    ##

    TYPO_PATH = os.path.join ('webed', 'static', 'lib', 'typojs')
    TYPO_PATH = os.getenv ('TYPO_PATH', TYPO_PATH)
    TYPO_DICT_PATH = os.path.join (TYPO_PATH, 'typo', 'dictionaries')
    TYPO_DICT_PATH = os.getenv ('TYPO_DICT_PATH', TYPO_DICT_PATH)

    ##
    ## At session setup data is required: ARCHIVE_PATH is the path to the
    ## archives, which will be imported on the first visit.
    ##

    ARCHIVE_PATH = os.path.join ('webed', 'static', 'webed-ext', 'dat')
    ARCHIVE_PATH = os.getenv ('ARCHIVE_PATH', ARCHIVE_PATH)

    ARCHIVE_INCLUDE = eval (os.getenv (
        'ARCHIVE_INCLUDE', str ([r'(.+)\.zip$'])))
    ARCHIVE_EXCLUDE = eval (os.getenv (
        'ARCHIVE_EXCLUDE', str ([r'^_', r'^\.'])))

    ##
    ## COW_BASE is the base path for the copy-on-write storage backend, whereas
    ## the actual data is kept in COW_ROOT.
    ##

    COW_BASE = os.path.join (os.path.sep, 'var', 'www', 'webed')
    COW_BASE = os.getenv ('COW_BASE', COW_BASE)
    COW_ROOT = os.path.join (COW_BASE, 'conw')
    COW_ROOT = os.getenv ('COW_ROOT', COW_ROOT)

    ##
    ## VCS_BASE is the path for the storage backend, whereas VCS_ROOT contains
    ## the actual repositories (based on AcidFS/GIT). The VCS_USER and VCS_MAIL
    ## are used to set corresponding transaction metadata. And the VCS_CONF is
    ## for custom repository configuration.
    ##

    VCS_BASE = os.path.join (os.path.sep, 'var', 'www', 'webed')
    VCS_BASE = os.getenv ('VCS_BASE', VCS_BASE)
    VCS_ROOT = os.path.join (VCS_BASE, 'acid')
    VCS_ROOT = os.getenv ('VCS_ROOT', VCS_ROOT)
    VCS_USER = os.getenv ('VCS_USER', '') ## author/committer
    VCS_MAIL = os.getenv ('VCS_MAIL', '') ## email address
    VCS_CONF = os.getenv ('VCS_CONF', '') ## repo configuration

    ##
    ## DEFAULT_MAIL_RECEIVERS should filled with those receivers' emails, who
    ## are in charge of processing feedback mails.
    ##

    DEFAULT_MAIL_RECEIVERS = eval (os.getenv (
        'DEFAULT_MAIL_RECEIVERS', str ([])))

    ##
    ## If a node has more than MAX_NODE_SIZE **immediate** sub-nodes (nodes and
    ## leafs), then their sub-nodes are *not* preloaded. For MAX_NODE_SIZE = 0,
    ## the sub-nodes of any given node is loaded only on demand.
    ##

    MAX_NODE_SIZE = int (os.getenv ('MAX_NODE_SIZE', 16))

    ##
    ## If the height of a tree below a given node is larger than MAX_NODE_LEVEL
    ## then the sub-nodes of the next layer are *not* preloaded. This means, if
    ## MAX_NODE_LEVEL = 0, then the sub-nodes are only loaded on demand.
    ##

    MAX_NODE_LEVEL = int (os.getenv ('MAX_NODE_LEVEL', 2))

    ##
    ## Limits the max. payload to MAX_CONTENT_LENGTH bytes. If a larger file is
    ## transmitted, an `RequestEntityTooLarge` exception will be raised.
    ##

    MAX_CONTENT_LENGTH = int (os.getenv ('MAX_CONTENT_LENGTH', 1024 ** 2))

    ##
    ## BLOG_ID, BLOG_URL, BLOG_API_KEY and BLOG_URL should be overridden in
    ## production environment with proper values.
    ##

    BLOG_ID = os.getenv ('BLOG_ID', None)
    BLOG_URL = os.getenv ('BLOG_URL', None)
    BLOG_API_KEY = os.getenv ('BLOG_API_KEY', None)
    BLOG_HEADERS = eval (os.getenv ('BLOG_HEADERS', str (None)))

    ##
    ## FORUM_URL points to an *external* address where the builtin board system
    ## has been setup.
    ##

    FORUM_URL = os.getenv ('FORUM_URL', None)

    ##
    ## Override MAIL settings in production environment with proper values.
    ##

    MAIL_SERVER = os.getenv ('MAIL_SERVER', None)
    MAIL_PORT = int (os.getenv ('MAIL_PORT', 587))
    MAIL_USE_TLS = eval (os.getenv ('MAIL_USE_TLS', str (True)))
    MAIL_USERNAME = os.getenv ('MAIL_USERNAME', None)
    MAIL_PASSWORD = os.getenv ('MAIL_PASSWORD', None)

    DEFAULT_MAIL_SENDER = ('sender', 'mail@address.net')
    DEFAULT_MAIL_SENDER = eval (os.getenv (
        'DEFAULT_MAIL_SENDER', str (DEFAULT_MAIL_SENDER)))

    DEFAULT_MAIL_RECEIVERS = []
    DEFAULT_MAIL_RECEIVERS = eval (os.getenv (
        'DEFAULT_MAIL_RECEIVERS', str (DEFAULT_MAIL_RECEIVERS)))

    ##
    ## ADSENSE controls if the application should displays advertisement from
    ## Google's ad network.
    ##

    ADSENSE = eval (os.getenv ('ADSENSE', str (True)))

    ##
    ## Override CDN settings in production environment with proper value.
    ##

    CDN = os.getenv ('CDN', None)

###############################################################################
###############################################################################
