__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.views import MethodView
from flask.globals import request
from flask.helpers import jsonify
from flask import session

from webed.app import app
from webed.extensions import db
from webed.models import Set, Doc
from webed.linq import Q

from webed.config import DefaultConfig as config

###############################################################################
###############################################################################

class SetsApi (MethodView):

    def post (self, json=True): return sets_create (json=json)
    def get (self, json=True): return sets_read (json=json)
    def put (self, json=True): return sets_update (json=json)
    def delete (self, json=True): return sets_delete (json=json)

app.add_url_rule ('/sets', view_func=SetsApi.as_view ('sets'))

def sets_create (json=True):
    return node_create (docs=False, json=json)

@app.route ('/sets/root', methods=['GET'])
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

app.add_url_rule ('/node', view_func=NodeApi.as_view ('node'))

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
    root = Q (Set.query).one_or_default (base=base, uuid=root_uuid, default=base)
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

@app.route ('/node/root', methods=['GET'])
def node_read (docs=True, json=True):

    uuid = request.args.get ('uuid', session['root_uuid'])
    assert uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    set = Q (base.subsets).one_or_default (uuid=uuid, default=base)
    assert set

    doc2exts = map (lambda d: doc2ext (d, True), set.docs) if docs else []
    set2exts = map (lambda s: set2ext (s, docs=docs), set.sets)

    result = dict (success=True, results=set2exts + doc2exts)
    return jsonify (result) if json else result

def node_update (docs=True, json=True):

    result = dict (success=True)
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
        result = dict (success=True, results=[])

    elif docs:
        result = doc_delete (json=False)

    else:
        result = dict (success=False, results=[])

    return jsonify (result) if json else result

###############################################################################
###############################################################################

class DocsApi (MethodView):

    def post (self, json=True): return doc_create (json)
    def get (self, json=True): return doc_read (json)
    def put (self, json=True): return doc_update (json)
    def delete (self, json=True): return doc_delete (json)

app.add_url_rule ('/docs', view_func=DocsApi.as_view ('docs'))

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
    ext = request.json.get ('ext', None)
    assert ext or not ext

    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (Set.query).one_or_default (base=base, uuid=root_uuid, default=base)
    assert root

    if uuid:
        doc = Doc (name, ext, root, mime=mime, uuid=uuid)
    else:
        doc = Doc (name, ext, root, mime=mime)

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

    uuid = request.args.get ('uuid', None)
    assert uuid

    result = dict (success=True, uuid=uuid)
    return jsonify (result) if json else result

def doc_delete (json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid
    base = Q (Set.query).one (uuid=session['root_uuid'])
    assert base

    doc = Q (base.subdocs).one_or_default (uuid=uuid)
    if doc:
        db.session.delete (doc)
        db.session.commit ()
        result = dict (success=True, results=[])

    else:
        result = dict (success=False, results=[])

    return jsonify (result) if json else result

###############################################################################
###############################################################################

def set2ext (set, docs=True):

    assert set
    assert set.uuid
    assert set.name
    assert set.mime
    assert set.root.uuid

    def to_ext (set, results):

        return {
            'loaded': results is not None,
            'root_uuid': set.root.uuid,
            'results': results,
            'expandable': True,
            'expanded': False,
            'uuid': set.uuid,
            'name': set.name,
            'mime': set.mime,
            'leaf': False,
            'size': 0,
            }

    if set.sets.count () + set.docs.count () >= config.LOADSKIP_LIMIT:

        return to_ext (set, results=None)

    sets = map (lambda s: set2ext (s, docs=docs), set.sets)
    results = map (lambda doc: doc2ext (doc, fullname=True), set.docs) + sets\
    if docs else sets

    return to_ext (set, results=results)

def doc2ext (doc, fullname=False):

    assert doc
    assert doc.ext
    assert doc.uuid
    assert doc.mime
    assert doc.root.uuid
    assert doc.fullname if fullname else doc.name

    return {
        'name': doc.fullname if fullname else doc.name,
        'root_uuid': doc.root.uuid,
        'expandable': False,
        'expanded': False,
        'uuid': doc.uuid,
        'mime': doc.mime,
        'ext': doc.ext,
        'loaded': True,
        'leaf': True,
        'size': 0
    }

###############################################################################
###############################################################################
