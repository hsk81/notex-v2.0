__author__ = 'hsk81'

###############################################################################
###############################################################################

from compressinja.html import HtmlCompressor
from flask.globals import session
from flask.app import Flask

from .config import DefaultConfig

###############################################################################
###############################################################################

class WebedApplication (Flask):

    def __init__ (self, *args, **kwargs):
        super (WebedApplication, self).__init__ (*args, **kwargs)

    @property
    def session_manager (self):
        from .session import SessionManager
        return SessionManager (session)

    def is_dev (self):
        return self.debug or self.testing

    dev = property (is_dev)

###############################################################################
###############################################################################

app = WebedApplication (__name__)
app.config.from_object (DefaultConfig)

if not app.testing:
    app.config.from_envvar ('WEBED_SETTINGS', silent=False)

if not app.dev:
    app.jinja_env.add_extension (HtmlCompressor)

@app.errorhandler (Exception)
def exception_logger (ex):
    from .ext import logger
    logger.exception (ex)

###############################################################################
###############################################################################
