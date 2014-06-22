#!../../bin/python

###############################################################################
##
## Configuration: Production Environment
## =====================================
##
## * You should change values with a `[!!]` mark **definitely**, with a `[??]`
##   mark **probably**, and can leave values with a `[ok]` mark unchanged.
##
## * All values should be overrideable with environment variables, but e.g. for
##   the `SECRET_KEY` it is *not* recommended: hard-code it here instead, since
##   changing secret-keys with each run will invalidate current sessions!
##
## * Once changed, rebuild the docker container to ensure that they will also
##   be applied in production: Run `docker build -rm -t hsk81/notex:run .` in
##   the repository's top level.
##
###############################################################################

import os

###############################################################################
###############################################################################

SECRET_KEY = '000000000000000000000000000000000000000=' ## [!!]
SECRET_KEY = os.getenv ('SECRET_KEY', SECRET_KEY)

###############################################################################
###############################################################################

SQLALCHEMY_DATABASE_URI = os.getenv ('SQLALCHEMY_DATABASE_URI',
    'postgresql://webed-p:password@localhost/webed-p') ## [ok]

###############################################################################
###############################################################################

VCS_USER = os.getenv ('VCS_USER', 'NoTex.ch') ## [ok]
VCS_MAIL = os.getenv ('VCS_MAIL', 'user@notex.ch') ## [ok]
VCS_CONF = '[user]\n\tname = %s\n\temail = %s\n' % (VCS_USER, VCS_MAIL)
VCS_CONF+= '[committer]\n\tname = %s\n\temail = %s\n' % (VCS_USER, VCS_MAIL)
VCS_CONF+= '[gitweb]\n\towner = %s\n' % VCS_USER ## [ok]
VCS_CONF = os.getenv ('VCS_CONF', VCS_CONF)

###############################################################################
###############################################################################

MAIL_SERVER = os.getenv ('MAIL_SERVER', 'SMTP.SERVER.NET') ## [??]
MAIL_PORT = int (os.getenv ('MAIL_PORT', 587)) ## [ok]
MAIL_USE_TLS = eval (os.getenv ('MAIL_USE_TLS', str (True))) ## [ok]
MAIL_USERNAME = os.getenv ('MAIL_USERNAME', 'USERNAME') ## [??]
MAIL_PASSWORD = os.getenv ('MAIL_PASSWORD', 'PASSWORD') ## [??]

DEFAULT_MAIL_SENDER = eval (os.getenv (
    'DEFAULT_MAIL_SENDER', str (('SENDER', 'SENDER@MAIL.NET')))) ## [??]
DEFAULT_MAIL_RECEIVERS = eval (os.getenv (
    'DEFAULT_MAIL_RECEIVERS', str (['RECEIVER@MAIL.NET']))) ## [??]

###############################################################################
###############################################################################

BLOG_ID = os.getenv ('BLOG_ID', str (
    '0000000000000000000')) ## [??]
BLOG_URL = os.getenv ('BLOG_URL', str (
    'https://www.googleapis.com/blogger/v3/blogs/%s/posts' % BLOG_ID)) ## [ok]
BLOG_API_KEY = os.getenv ('BLOG_API_KEY', str (
    '0000000000000--000000000000000000000000')) ## [??]
BLOG_HEADERS = eval (os.getenv ('BLOG_HEADERS', str (
    {'Accept-Encoding': 'gzip', 'User-Agent': 'NoTex.ch (gzip)'}))) ## [ok]

###############################################################################
###############################################################################

FORUM_URL = os.getenv ('FORUM_URL', 'https://bbs.notex.ch/index.php') ## [ok]

###############################################################################
###############################################################################

if __name__ == '__main__':

    import os
    import base64

    print "SECRET_KEY = '%s'" % base64.b32encode (os.urandom (24))

###############################################################################
###############################################################################
