__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.ext.assets import Environment
from webassets.loaders import YAMLLoader

from ..app import app

###############################################################################
###############################################################################

loader = YAMLLoader (app.config['YML_FILE'])
bundles = loader.load_bundles ()

assets = Environment (app)
assets.manifest = 'cache'
assets.register (bundles)
assets.url = app.config.get ('CDN')

###############################################################################
###############################################################################
