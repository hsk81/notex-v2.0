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

class Logger:

    def __init__ (self, app):

        log_file = os.path.join (app.root_path, app.config['LOG_FILE'])
        assert log_file

        file_handler = logging.handlers.RotatingFileHandler (
            log_file, maxBytes=1024*512, backupCount=16
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
