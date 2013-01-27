__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.datastructures import FileStorage

from ..app import app
from ..models import Node
from ..ext import db, logger
from ..util import jsonify, in_rxs
from ..views.io import archive_upload

from datetime import datetime
from anchor import SessionAnchor

import os

###############################################################################
###############################################################################

class SessionManager:

    def __init__ (self, session):
        self._anchor = SessionAnchor (session)

    def setup (self):
        base_uuid = setup_session (); assert base_uuid
        self._anchor.set_value (base_uuid)

    def reset (self):
        self._anchor.reset ()
        self.setup ()

    def refresh (self, json=True):
        base_uuid = self._anchor.refresh ()
        if base_uuid: self.cleanup (base_uuid)
        self.setup ()

        result = dict (success=True, timestamp=datetime.now ())
        return jsonify (result) if json else result

    def cleanup (self, base_uuid):
        """
        TODO: Queue delete task using a distributed task queue!
        """
        assert base_uuid
        ##  base = Q (Node.query).one_or_default (uuid=base_uuid)
        ##  if base: db.session.delete (base); db.session.commit ()

    @property
    def authenticated (self):
        """
        TODO: Implement proper authentication mechanism based on admin login!
        """
        return app.is_dev ()

    @property
    def virgin (self):
        return not self._anchor.initialized

    @property
    def anchor (self):
        return self._anchor.value

    @property
    def sid (self):
        return self._anchor.sid

###############################################################################
###############################################################################

def setup_session ():

    base = Node ('root', root=None, mime='application/root')
    db.session.add (base)

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    archive_exclude = app.config['ARCHIVE_EXCLUDE']
    assert isinstance (archive_exclude, list)
    archive_require = app.config['ARCHIVE_REQUIRE']
    assert isinstance (archive_require, list)

    try:
        for path, dirnames, filenames in os.walk (archive_path):
            for filename in filenames:

                if in_rxs (filename, archive_exclude): continue
                if in_rxs (filename, archive_require): continue

                with open (os.path.join (path, filename), mode='r') as stream:

                    try:
                        db.session.begin (nested=True)
                        fs = FileStorage (stream=stream, filename=filename)
                        archive_upload (file=fs, root=base, skip_commit=True)
                        db.session.commit ()
                    except Exception, ex:
                        db.session.rollback ()
                        logger.exception (ex)

        db.session.execute ('SELECT npt_insert_base (%d);' % base.id)
        db.session.commit ()
    except Exception, ex:
        db.session.rollback ()
        logger.exception (ex)
        raise

    return base.uuid

###############################################################################
###############################################################################
