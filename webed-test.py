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

    def test_models (self):
        set = webed.Set ('folder')
        doc = webed.Doc ('file', 'txt', size=1024, set=set)
        webed.db.session.add (set)
        webed.db.session.add (doc)
        webed.db.session.commit ()

###############################################################################
###############################################################################

if __name__ == '__main__':
    unittest.main ()