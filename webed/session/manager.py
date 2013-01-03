__author__ = 'hsk81'

###############################################################################
###############################################################################

from ..ext import db
from ..app import app
from ..util import jsonify
from ..models import Node, Leaf
from ..models import TextProperty, LargeBinaryProperty

from datetime import datetime
from anchor import SessionAnchor as Anchor

###############################################################################
###############################################################################

class SessionManager:

    def __init__ (self, session):
        self.session = session

    def setup (self):
        base_uuid = setup_session (); assert base_uuid
        Anchor (self.session).set_value (base_uuid)

    def reset (self):
        Anchor (self.session).reset ()
        self.setup ()

    def refresh (self, json=True):
        base_uuid = Anchor (self.session).delete ()
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
        return not Anchor (self.session).initialized

    @property
    def anchor (self):
        return Anchor (self.session).value

###############################################################################
###############################################################################

def setup_session ():

    base = Node ('root', root=None, mime='application/root')
    db.session.add (base)
    db.session.commit ()

    setup_article (root=base)
    setup_report (root=base)

    leaf = Leaf ('author.txt', root=base, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)

    leaf = Leaf ('about.tiff', root=base, mime='image/tiff')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/tiff')
    db.session.add (prop)

    node = Node ('Archive', root=base, mime='application/project')
    db.session.add (node)
    for index in range (50):
        leaf = Leaf ('file-%03d.txt' % index, root=node, mime='text/plain')
        db.session.add (leaf)
        prop = TextProperty ('data', u'....', leaf, mime='text/plain')
        db.session.add (prop)

    db.session.commit ()
    return base.uuid

def setup_article (root):

    node = Node ('Article', root, mime='application/project')
    db.session.add (node)
    leaf = Leaf ('options.cfg', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)
    leaf = Leaf ('content.txt', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)

    node = Node ('resources', node, mime='application/folder')
    db.session.add (node)
    leaf = Leaf ('wiki.png', node, mime='image/png')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/png')
    db.session.add (prop)
    leaf = Leaf ('time.jpg', node, mime='image/jpg')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/jpg')
    db.session.add (prop)

def setup_report (root):

    node = Node ('Report', root, mime='application/project')
    db.session.add (node)
    leaf = Leaf ('options.cfg', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)
    leaf = Leaf ('content.txt', node, mime='text/plain')
    db.session.add (leaf)
    prop = TextProperty ('data', u'....', leaf, mime='text/plain')
    db.session.add (prop)

    node = Node ('resources', node, mime='application/folder')
    db.session.add (node)
    leaf = Leaf ('wiki.png', node, mime='image/png')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/png')
    db.session.add (prop)
    leaf = Leaf ('time.jpg', node, mime='image/jpg')
    db.session.add (leaf)
    prop = LargeBinaryProperty ('data', '....', leaf, mime='image/jpg')
    db.session.add (prop)

###############################################################################
###############################################################################
