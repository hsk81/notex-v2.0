__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.app import Flask
from config import DefaultConfig

###############################################################################
###############################################################################

class WebedApplication (Flask):

    def is_dev (self):
        return self.debug or self.testing
    dev = property (is_dev)

app = WebedApplication (__name__)
app.config.from_object (DefaultConfig)

if not app.testing:
    app.config.from_envvar ('WEBED_SETTINGS', silent=False)

###############################################################################
###############################################################################
