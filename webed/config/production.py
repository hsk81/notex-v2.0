#!../../bin/python

###############################################################################
###############################################################################

SECRET_KEY = '000000000000000000000000000000000000000='

###############################################################################
###############################################################################

PRIVILEGED_ADDRESSES = ['127.0.0.1']
SQLALCHEMY_DATABASE_URI = 'postgresql://webed-p:password@localhost/webed-p'

VCS_USER = 'NoTex.ch'
VCS_MAIL = 'user@notex.ch'
VCS_CONF = '[user]\n\tname = %s\n\temail = %s\n' % (VCS_USER, VCS_MAIL)
VCS_CONF+= '[committer]\n\tname = %s\n\temail = %s\n' % (VCS_USER, VCS_MAIL)
VCS_CONF+= '[gitweb]\n\towner = %s\n' % VCS_USER

MAIL_SERVER = 'SMTP.SERVER.NET'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = 'USERNAME'
MAIL_PASSWORD = 'PASSWORD'

DEFAULT_MAIL_SENDER = ('SENDER', 'SENDER@MAIL.NET')
DEFAULT_MAIL_RECEIVERS = ['RECEIVER@MAIL.NET']

BLOG_ID = '0000000000000000000'
BLOG_URL = 'https://www.googleapis.com/blogger/v3/blogs/%s/posts' % BLOG_ID
BLOG_API_KEY = '0000000000000--000000000000000000000000'
BLOG_HEADERS = {'Accept-Encoding': 'gzip', 'User-Agent': 'NoTex.ch (gzip)'}

FORUM_URL = 'http://bbs.notex/index.php'

###############################################################################
###############################################################################

if __name__ == '__main__':

    import os
    import base64

    print "SECRET_KEY = '%s'" % base64.b32encode (os.urandom (24))

###############################################################################
###############################################################################
