__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..ext.cache import cache

import uuid
import hashlib

###############################################################################
###############################################################################

class SessionAnchor (object):

    def __init__ (self, session):

        if not session.get ('_token'):
            session['_token'] = hashlib.md5 (unicode (uuid.uuid4 ())).digest ()
            session.permanent = True

        self._sid = session['_id']
        self._token = session['_token']

    def __repr__ (self):

        version, _ = self.get_version ()
        sid = hashlib.md5 (self._sid).hexdigest ()
        token = hashlib.md5 (self._token).hexdigest ()

        return str ((sid, token, version))

    ###########################################################################

    def get_version_key (self):
        return cache.make_key ('version')

    def get_version (self):
        key = self.get_version_key ()
        return cache.get_number (key) or 0, key

    ###########################################################################

    def get_value_key (self):
        version, _ = self.get_version ()
        return cache.make_key (version, self._sid, self._token), version

    def get_value (self):
        key, _ = self.get_value_key ()
        return cache.get (key), key

    def set_value (self, value):
        key, _ = self.get_value_key ()
        cache.set (key, value)

    def clear (self):
        key, _ = self.get_value_key ()
        cache.delete (key)

    ###########################################################################

    @property
    def key (self):
        key, _ = self.get_value_key ()
        return key

    @property
    def value (self):
        value, _ = self.get_value ()
        return value

    @property
    def version (self):
        version, _ = self.get_version ()
        return version

    ###########################################################################

    @property
    def sid (self):
        return self._sid

    @property
    def token (self):
        return self._token

    @property
    def initialized (self):
        return self.value is not None

    ###########################################################################

    def reset (self):
        version, key = self.get_version ()
        cache.set_number (key, version + 1, expiry=cache.NEVER)
        return version

    def refresh (self):
        value, key = self.get_value ()
        if key: cache.delete (key)
        return value

###############################################################################
###############################################################################
