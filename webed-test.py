#!bin/python

###############################################################################
###############################################################################

import webed
import unittest

###############################################################################
###############################################################################

class WebedTestCase (unittest.TestCase):

    def setUp (self):

        webed.db.create_all ()

    def tearDown (self):

        webed.db.drop_all ()

    def create_models (self):

        set = webed.Set ('root', root=None)
        sub = webed.Set ('folder', root=set)
        doc = webed.Doc ('file', 'txt', root=sub)

        return set, sub, doc

    def commit_models (self, (set, sub, doc)):

        webed.db.session.add (set)
        webed.db.session.add (sub)
        webed.db.session.add (doc)
        webed.db.session.commit ()

    def assert_models_basic (self, (set, sub, doc)):

        self.assertIsNone (set.base)
        self.assertIs (sub.base, set)
        self.assertIs (doc.base, set)

        self.assertIsNone (set.root)
        self.assertIs (sub.root, set)
        self.assertIs (doc.root, sub)

    def assert_models_relations (self, (set, sub, doc)):

        self.assertEqual (set.sets.all (), [sub])
        self.assertEqual (set.subsets.all (), [sub])
        self.assertEqual (set.docs.all (), [])
        self.assertEqual (set.subdocs.all (), [doc])

        self.assertEqual (sub.sets.all (), [])
        self.assertEqual (sub.subsets.all (), [])
        self.assertEqual (sub.docs.all (), [doc])
        self.assertEqual (sub.subdocs.all (), [])

    def test_models_after_commit (self):

        models = self.create_models ()
        self.commit_models (models)
        self.assert_models_basic (models)
        self.assert_models_relations (models)

    def test_models_before_commit (self):

        models = self.create_models ()
        self.assert_models_basic (models)
        self.assert_models_relations (models)
        self.commit_models (models)

###############################################################################
###############################################################################

if __name__ == '__main__':

    unittest.main ()

###############################################################################
###############################################################################
