__author__ = 'hsk81'

###############################################################################
###############################################################################

from werkzeug.datastructures import FileStorage
from flask.ext.login import current_user
from sqlalchemy.sql import func, select

from ..app import app
from ..models import Node
from ..ext import db, logger
from ..util import Q, jsonify, in_rxs
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
        if not app.is_dev ():
            base = Q (Node.query).one_or_default (uuid=base_uuid)
            if base: db.session.delete (base); db.session.commit ()

    @property
    def authenticated (self):
        return current_user.is_authenticated () or app.is_dev ()

    @property
    def virgin (self):
        return not self._anchor.initialized

    @property
    def anchor (self):
        return self._anchor.value

###############################################################################
###############################################################################

@db.commit ()
def setup_session ():
    base = setup_session_base ()
    assert base and base.id

    archive_path = app.config['ARCHIVE_PATH']
    assert archive_path
    archive_exclude = app.config['ARCHIVE_EXCLUDE']
    assert isinstance (archive_exclude, list)
    archive_include = app.config['ARCHIVE_INCLUDE']
    assert isinstance (archive_include, list)

    for path, dirnames, filenames in os.walk (archive_path):
        for filename in sorted (filenames):

            if in_rxs (filename, archive_exclude): continue
            if not in_rxs (filename, archive_include): continue

            with open (os.path.join (path, filename), mode='r') as stream:

                try:
                    fs = FileStorage (stream=stream, filename=filename)
                    archive_upload (source=fs, base=base, skip_commit=True)
                except Exception, ex:
                    logger.exception (ex) ## no re-raise!

        break ## check only first level

    db.session.execute (select ([func.npt_delete_base (base.id)]))
    db.session.execute (select ([func.npt_insert_base (base.id)]))
    return base.uuid

@db.nest ()
def setup_session_base ():
    base = Node ('root', root=None, mime='application/root')
    db.session.add (base)
    return base

###############################################################################
###############################################################################
