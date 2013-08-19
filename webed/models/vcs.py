__author__ = 'hsk81'

###############################################################################
###############################################################################

import os
import abc
import acidfs
import subprocess
import transaction

from ..app import app

###############################################################################
###############################################################################

class VcsMixin (object):

    @property
    def vcs (self):
        if not hasattr (self, '_vcs'):
            self._vcs = None

        if self._vcs is None:
            path = os.path.join (app.config['FS_ACID'], self.vcs_path)
            exists = os.path.exists (path)
            self._vcs = acidfs.AcidFS (path, bare=True)

            if not exists:
                with open (os.path.join (path, 'description'), 'w') as target:
                    target.write (self.vcs_description)
                with open (os.path.join (path, 'config'), 'a') as target:
                    target.write (app.config['FS_ACID_REPO_CFG'])

        return self._vcs

    @abc.abstractproperty
    def vcs_path (self):
        pass

    @abc.abstractproperty
    def vcs_description (self):
        pass

    def post_update (self):
        target = os.path.join (self.vcs.db, 'hooks', 'post-update')
        if not os.path.exists (target):
            source = os.path.join (self.vcs.db, 'hooks', 'post-update.sample')
            os.rename (source, target)

        subprocess.check_call ([target], cwd=self.vcs.db)

###############################################################################
###############################################################################

class VcsTransactionMixin (VcsMixin):

    def transact (self, note):
        current = transaction.get()
        current.note (note)
        current.setExtendedInfo ('user', app.config['FS_ACID_USER'])
        current.setExtendedInfo ('email', app.config['FS_ACID_MAIL'])

        transaction.commit ()
        self.post_update ()

###############################################################################
###############################################################################
