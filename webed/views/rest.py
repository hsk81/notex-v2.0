__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.views import MethodView
from flask.globals import request
from flask.helpers import jsonify

from flask import Blueprint, session

from ..config import DefaultConfig
from ..models import Set, Doc
from ..app import app
from ..ext import db
from ..util import Q

###############################################################################
###############################################################################

rest = Blueprint ('rest', __name__)

###############################################################################
###############################################################################

class SetsApi (MethodView):

    def post (self, json=True): return sets_create (json=json)
    def get (self, json=True): return sets_read (json=json)
    def put (self, json=True): return sets_update (json=json)
    def delete (self, json=True): return sets_delete (json=json)

rest.add_url_rule ('/sets', view_func=SetsApi.as_view ('sets'))

def sets_create (json=True):
    return node_create (docs=False, json=json)

@rest.route ('/sets/root', methods=['GET'])
def sets_read (json=True):
    return node_read (docs=False, json=json)

def sets_update (json=True):
    return node_update (docs=False, json=json)

def sets_delete (json=True):
    return node_delete (docs=False, json=json)

###############################################################################
###############################################################################

class NodeApi (MethodView):

    def post (self, docs=True, json=True): return node_create (docs, json)
    def get (self, docs=True, json=True): return node_read (docs, json)
    def put (self, docs=True, json=True): return node_update (docs, json)
    def delete (self, docs=True, json=True): return node_delete (docs, json)

rest.add_url_rule ('/node', view_func=NodeApi.as_view ('node'))

def node_create (docs=True, json=True):

    if not request.is_xhr:
        request.json = request.form

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid or not root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (Set.query).one_or_default (base=base,uuid=root_uuid,default=base)
    assert root

    if uuid:
        set = Set (name, root, mime=mime, uuid=uuid)
    else:
        set = Set (name, root, mime=mime)

    db.session.add (set)
    db.session.commit ()

    result = dict (success=True,
        results=map (lambda s: set2ext (s, docs=docs), [set]))

    return jsonify (result) if json else result

@rest.route ('/node/root', methods=['GET'])
def node_read (docs=True, json=True):

    uuid = request.args.get ('uuid', session['root_uuid'])
    assert uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    set = Q (base.subsets).one_or_default (uuid=uuid, default=base)
    assert set

    doc2exts = map (lambda d: doc2ext (d), set.docs) if docs else []
    set2exts = map (lambda s: set2ext (s, docs=docs), set.sets)

    result = dict (success=True, results=set2exts + doc2exts)
    return jsonify (result) if json else result

def node_update (docs=True, json=True):

    if not request.is_xhr:
        request.json = request.form

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid
    name = request.json.get ('name', None)
    assert name
    mime = request.json.get ('mime', None)
    assert mime

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    set = Q (base.subsets).one_or_default (uuid=uuid)
    if set:
        if set.root and set.root.uuid != root_uuid:
            set.root = Q (Set.query).one (uuid=root_uuid)
            assert set.root

        if set.name != name: set.name = name
        if set.mime != mime: set.mime = mime

        db.session.commit ()

        result = dict (success=True)
    else:
        result = doc_update (json=False)

    return jsonify (result) if json else result

def node_delete (docs=True, json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    set = Q (base.subsets).one_or_default (uuid=uuid)
    if set:
        db.session.delete (set)
        db.session.commit ()

        result = dict (success=True)
    else:
        result = doc_delete (json=False)

    return jsonify (result) if json else result

###############################################################################
###############################################################################

class DocsApi (MethodView):

    def post (self, json=True): return doc_create (json)
    def get (self, json=True): return doc_read (json)
    def put (self, json=True): return doc_update (json)
    def delete (self, json=True): return doc_delete (json)

rest.add_url_rule ('/docs', view_func=DocsApi.as_view ('docs'))

def doc_create (json=True):

    if not request.is_xhr:
        request.json = request.form

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid or not root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (Set.query).one_or_default (base=base,uuid=root_uuid,default=base)
    assert root

    if uuid:
        doc = Doc (name, root, mime=mime, uuid=uuid)
    else:
        doc = Doc (name, root, mime=mime)

    db.session.add (doc)
    db.session.commit ()

    result = dict (success=True, results=map (lambda d: doc2ext (d), [doc]))
    return jsonify (result) if json else result

def doc_read (json=True):

    uuid = request.args.get ('uuid', None)
    assert uuid or not uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base

    if uuid:
        docs = Q (base.subdocs).all (uuid=uuid)
    else:
        docs = Q (base.subdocs).all ()

    result = dict (success=True, results=map (doc2ext, docs))
    return jsonify (result) if json else result

def doc_update (json=True):

    if not request.is_xhr:
        request.json = request.args

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    doc = Q (base.subdocs).one (uuid=uuid)
    assert doc

    if doc.root and doc.root.uuid != root_uuid:
        doc.root = Q (Set.query).one (uuid=root_uuid)
        assert doc.root

    if mime and doc.mime != mime: doc.mime = mime
    if name and doc.name != name: doc.name = name

    db.session.commit ()

    result = dict (success=True)
    return jsonify (result) if json else result

def doc_delete (json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    doc = Q (base.subdocs).one_or_default (uuid=uuid)
    assert doc

    db.session.delete (doc)
    db.session.commit ()

    result = dict (success=True)
    return jsonify (result) if json else result

###############################################################################
###############################################################################

def set2ext (set, docs=True):

    assert set
    assert set.uuid
    assert set.name
    assert set.mime
    assert set.root.uuid if set.root else True

    def to_ext (set, results):

        return {
            'expandable': True,
            'expanded': False,
            'leaf': False,
            'loaded': results is not None,
            'mime': set.mime,
            'name': set.name,
            'size': 0,
            'results': results,
            'root_uuid': set.root.uuid if set.root else None,
            'uuid': set.uuid,
        }

    if set.sets.count () + set.docs.count () >= DefaultConfig.LOADSKIP_LIMIT:

        return to_ext (set, results=None)

    sets = map (lambda s: set2ext (s, docs=docs), set.sets)
    results = map (lambda doc: doc2ext (doc), set.docs) + sets \
        if docs else sets

    return to_ext (set, results=results)

def doc2ext (doc):

    assert doc
    assert doc.uuid
    assert doc.mime
    assert doc.root
    assert doc.root.uuid
    assert doc.name

    return {
        'expandable': False,
        'expanded': False,
        'leaf': True,
        'loaded': True,
        'mime': doc.mime,
        'name': doc.name,
        'size': 0,
        'results': None,
        'root_uuid': doc.root.uuid,
        'uuid': doc.uuid,
    }

###############################################################################
###############################################################################

app.register_blueprint (rest)

###############################################################################
###############################################################################
