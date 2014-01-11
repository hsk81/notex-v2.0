#!../../bin/python

###############################################################################
###############################################################################

import os

###############################################################################
###############################################################################

SQLALCHEMY_DATABASE_URI = os.getenv ('SQLALCHEMY_DATABASE_URI',
    'postgresql://webed-p:password@localhost/webed-p')

###############################################################################
###############################################################################

VCS_USER = os.getenv ('VCS_USER', 'NoTex.ch')
VCS_MAIL = os.getenv ('VCS_MAIL', 'user@notex.ch')
VCS_CONF = '[user]\n\tname = %s\n\temail = %s\n' % (VCS_USER, VCS_MAIL)
VCS_CONF+= '[committer]\n\tname = %s\n\temail = %s\n' % (VCS_USER, VCS_MAIL)
VCS_CONF+= '[gitweb]\n\towner = %s\n' % VCS_USER
VCS_CONF = os.getenv ('VCS_CONF', VCS_CONF)

###############################################################################
###############################################################################

MAIL_SERVER = os.getenv ('MAIL_SERVER', 'SMTP.SERVER.NET')
MAIL_PORT = int (os.getenv ('MAIL_PORT', 587))
MAIL_USE_TLS = eval (os.getenv ('MAIL_USE_TLS', str (True)))
MAIL_USERNAME = os.getenv ('MAIL_USERNAME', 'USERNAME')
MAIL_PASSWORD = os.getenv ('MAIL_PASSWORD', 'PASSWORD')

DEFAULT_MAIL_SENDER = eval (os.getenv (
    'DEFAULT_MAIL_SENDER', str (('SENDER', 'SENDER@MAIL.NET'))))
DEFAULT_MAIL_RECEIVERS = eval (os.getenv (
    'DEFAULT_MAIL_RECEIVERS', str (['RECEIVER@MAIL.NET'])))

###############################################################################
###############################################################################

BLOG_ID = os.getenv ('BLOG_ID', str (
    '0000000000000000000'))
BLOG_URL = os.getenv ('BLOG_URL', str (
    'https://www.googleapis.com/blogger/v3/blogs/%s/posts' % BLOG_ID))
BLOG_API_KEY = os.getenv ('BLOG_API_KEY', str (
    '0000000000000--000000000000000000000000'))
BLOG_HEADERS = eval (os.getenv ('BLOG_HEADERS', str (
    {'Accept-Encoding': 'gzip', 'User-Agent': 'NoTex.ch (gzip)'})))

###############################################################################
###############################################################################

FORUM_URL = os.getenv ('FORUM_URL', 'http://bbs.notex.ch/index.php')

###############################################################################
###############################################################################

if __name__ == '__main__':

    import os
    import base64

    print "SECRET_KEY = '%s'" % base64.b32encode (os.urandom (24))

###############################################################################
###############################################################################
