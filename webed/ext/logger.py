__author__ = 'hsk81'

###############################################################################
###############################################################################

import os.path
import logging

from logging.handlers import RotatingFileHandler
from flask import current_app
from ..app import app

###############################################################################
###############################################################################

class Logger (object):

    def __init__ (self, app):

        if app is not None:
            self.app = app
            self.init_app (self.app)
        else:
            self.app = None

    def init_app (self, app, log_file=None):

        app.config.setdefault ('LOG_FILE', 'logger.log')
        self.LOG_FILE = log_file if log_file else app.config['LOG_FILE']
        assert self.LOG_FILE
        self.LOG_PATH = os.path.join (app.root_path, self.LOG_FILE)
        assert self.LOG_PATH

        file_handler = logging.handlers.RotatingFileHandler (
            self.LOG_PATH, maxBytes=1024*512, backupCount=16
        )

        file_handler.setFormatter (logging.Formatter (
            '%(asctime)s %(levelname)s: %(message)s @ %(pathname)s:%(lineno)d'
        ))

        file_handler.setLevel (logging.DEBUG)
        app.logger.addHandler (file_handler)
        app.logger.setLevel (logging.DEBUG)

    def __getattr__ (self, attr):

        return getattr (current_app.logger, attr)

###############################################################################
###############################################################################

logger = Logger (app)

###############################################################################
###############################################################################
