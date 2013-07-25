__author__ = 'hsk81'

###############################################################################
###############################################################################

from base import BaseTestCase

###############################################################################
###############################################################################

class PageTestCase (BaseTestCase):

    def page (self, value=None):

        if value != 'index':
            response = self.app.get ('/%s/?silent=True' % value)
        else:
            response = self.app.get ('/?silent=True')

        self.assertIsNotNone (response)
        self.assertEqual (response.status_code, 200)
        self.assertEqual (response.status, '200 OK')

        headers = response.headers

        self.assertIsNotNone (headers)
        self.assertEqual (headers['Content-Type'], 'text/html; charset=utf-8')
        self.assertGreater (['Content-Length'], 0)
        self.assertIsNotNone (headers['Set-Cookie'])

        return response

    def test_index (self):
        self.page (value='index')
    def test_home (self):
        self.page (value='home')
    def test_overview (self):
        self.page (value='overview')
    def test_tutorial (self):
        self.page (value='tutorial')
    def test_rest (self):
        self.page (value='rest')
    def test_faq (self):
        self.page (value='faq')
    def test_forum (self):
        self.page (value='forum')
    def test_contact (self):
        self.page (value='contact')

###############################################################################
###############################################################################
