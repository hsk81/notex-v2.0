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

        set = webed.Set ('root', root=None, base=None)
        sub = webed.Set ('folder', root=set, base=set)
        doc = webed.Doc ('file', 'txt', root=sub, base=set)

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

        self.assertIsNotNone (set.sets)
        self.assertIsNotNone (set.subsets)
        self.assertIsNotNone (set.docs)
        self.assertIsNotNone (set.subdocs)

        self.assertIn (sub, set.sets)
        self.assertIn (sub, set.subsets)
        self.assertNotIn (doc, set.docs.all ())
        self.assertIn (doc, set.subdocs.all ())

        self.assertIsNotNone (sub.sets)
        self.assertIsNotNone (sub.subsets)
        self.assertIsNotNone (sub.docs)
        self.assertIsNotNone (sub.subdocs)

        self.assertEqual ([], sub.sets.all ())
        self.assertEqual ([], sub.subsets.all ())
        self.assertIn (doc, sub.docs.all ())
        self.assertNotIn (doc, sub.subdocs.all ())

    def assert_models_relation_types (self, (set, sub, doc)):

        self.assertEqual (str (type (set.sets)),
            "<class 'sqlalchemy.orm.dynamic.AppenderBaseQuery'>")
        self.assertEqual (str (type (set.subsets)),
            "<class 'sqlalchemy.orm.dynamic.AppenderBaseQuery'>")
        self.assertEqual (str (type (set.docs)),
            "<class 'sqlalchemy.orm.dynamic.AppenderBaseQuery'>")
        self.assertEqual (str (type (set.subdocs)),
            "<class 'sqlalchemy.orm.dynamic.AppenderBaseQuery'>")

    def test_models_after_commit (self):

        models = self.create_models ()
        self.commit_models (models)
        self.assert_models_basic (models)
        self.assert_models_relations (models)
        self.assert_models_relation_types (models)

    def test_models_before_commit (self):

        models = self.create_models ()
        self.assert_models_basic (models)
        self.assert_models_relations (models)
        self.assert_models_relation_types (models)
        self.commit_models (models)

###############################################################################
###############################################################################

if __name__ == '__main__':

    unittest.main ()

###############################################################################
###############################################################################
