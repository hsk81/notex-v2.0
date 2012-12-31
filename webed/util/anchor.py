__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..ext.cache import cache

###############################################################################
###############################################################################

class Anchor (object):

    def __init__ (self, session, timeout=None):
        self.session = session
        self.timeout = timeout if timeout else 3600*72

    def get_version_key (self):
        return cache.make_key ('global', 'version', 'anchor')

    def get_version (self, key=None):
        version_key = key if key else self.get_version_key ()
        return (cache.get (version_key) or 0) if version_key else 0

    def get_value_key (self, version_key=None):
        version = self.get_version (key=version_key)
        return cache.make_key (self.session['_id'], 'anchor', version)

    def get_value (self, key=None):
        value_key = key if key else self.get_value_key ()
        return cache.get (value_key) if value_key else None

    def set_value (self, value, key=None):
        value_key = key if key else self.get_value_key ()
        if value_key: cache.set (value_key, value, timeout=self.timeout)

    def reset (self):
        version_key = self.get_version_key ()
        version = self.get_version(key=version_key)
        cache.set (version_key, version+1, timeout=0) ## indefinite

    def refresh (self):
        value_key = self.get_value_key ()
        value = self.get_value (key=value_key)
        if value: cache.delete (value_key)

     ## if value: ## TODO: Queue delete task!
     ##     base = Q (Node.query).one_or_default (uuid=value)
     ##     if base:
     ##         db.session.delete (base)
     ##         db.session.commit ()

    @property
    def initiated (self):
        return self.get_value () is not None

###############################################################################
###############################################################################
