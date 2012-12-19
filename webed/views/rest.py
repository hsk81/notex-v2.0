__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.views import MethodView
from flask.globals import request
from flask.helpers import jsonify

from flask import Blueprint, session

from ..config import DefaultConfig
from ..models import *
from ..app import app
from ..ext import db, logger
from ..util import Q

import sys
import json as JSON

###############################################################################
###############################################################################

rest = Blueprint ('rest', __name__)

###############################################################################
###############################################################################

class NodeApi (MethodView):

    def post (self, leafs=True, json=True): return node_create (leafs, json)
    def get (self, leafs=True, json=True): return node_read (leafs, json)
    def put (self, leafs=True, json=True): return node_update (leafs, json)
    def delete (self, leafs=True, json=True): return node_delete (leafs, json)

rest.add_url_rule ('/node', view_func=NodeApi.as_view ('node'))

def node_create (leafs=True, json=True):

    if not request.is_xhr:
        request.json = request.form

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid or not root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name is not None

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (base.subnodes).one_or_default (uuid=root_uuid, default=base)
    assert root

    if uuid:
        node = Node (name, root, mime=mime, uuid=uuid)
    else:
        node = Node (name, root, mime=mime)

    db.session.add (node)
    db.session.commit ()

    result = dict (success=True, result=node2ext (node, leafs=leafs))
    return jsonify (result) if json else result

@rest.route ('/node/root', methods=['GET'])
def node_read (leafs=True, json=True):

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base

    kwargs = {}
    uuid = request.args.get ('uuid', None)
    if uuid: kwargs['uuid'] = uuid
    mime = request.args.get ('mime', None)
    if mime: kwargs['mime'] = mime
    name = request.args.get ('name', None)
    if name: kwargs['name'] = name

    if uuid != '00000000-0000-0000-0000-000000000000':
        root_uuid = request.args.get ('root_uuid', None)
    else:
        root_uuid = request.args.get ('root_uuid', base.uuid)
        del kwargs['uuid']

    if root_uuid:
        root = Q (Node.query).one (uuid=root_uuid)
        node_query = root.not_leafs
        leaf_query = root.leafs
    else:
        node_query = base.not_subleafs
        leaf_query = base.subleafs

    if 'uuid' in kwargs and JSON.loads (request.args.get ('exclude', 'false')):
        node = Q (node_query).one (**kwargs)
        rhs = map (lambda n: node2ext (n, leafs=leafs), node.not_leafs)
        lhs = map (lambda l: leaf2ext (l), node.leafs)
    else:
        nodes = Q (node_query).all (**kwargs)
        lhs = map (lambda n: node2ext (n, leafs=leafs), nodes)
        leafs = Q (leaf_query).all (**kwargs)
        rhs = map (lambda l: leaf2ext (l), leafs)

    result = dict (success=True, results=lhs + rhs)
    return jsonify (result) if json else result

def node_update (leafs=True, json=True):

    if not request.is_xhr:
        request.json = request.args

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid
    name = request.json.get ('name', None)
    assert name is not None
    mime = request.json.get ('mime', None)
    assert mime

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    node = Q (base.subnodes).one_or_default (uuid=uuid)
    assert node

    if node.root and node.root.uuid != root_uuid:
        node.root = Q (base.subnodes).one (uuid=root_uuid)
        assert node.root

    if node.name != name: node.name = name
    if node.mime != mime: node.mime = mime

    db.session.commit ()
    result = dict (success=True, result=node2ext (node, leafs=leafs))

    return jsonify (result) if json else result

def node_delete (leafs=True, json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    node = Q (base.subnodes).one_or_default (uuid=uuid)
    if node:
        db.session.delete (node)
        db.session.commit ()

        result = dict (success=True, result=node2ext (node, leafs=leafs))
    else:
        result = dict (success=True)

    return jsonify (result) if json else result

###############################################################################
###############################################################################

class LeafsApi (MethodView):

    def post (self, json=True): return leaf_create (json)
    def get (self, json=True): return leaf_read (json)
    def put (self, json=True): return leaf_update (json)
    def delete (self, json=True): return leaf_delete (json)

rest.add_url_rule ('/leaf', view_func=LeafsApi.as_view ('leafs'))

def leaf_create (json=True):

    if not request.is_xhr:
        request.json = request.form

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid or not root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name is not None

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    root = Q (base.subnodes).one_or_default (uuid=root_uuid, default=base)
    assert root

    if uuid:
        leaf = Leaf (name, root, mime=mime, uuid=uuid)
    else:
        leaf = Leaf (name, root, mime=mime)

    db.session.add (leaf)
    db.session.commit ()

    result = dict (success=True, result=leaf2ext (leaf))
    return jsonify (result) if json else result

def leaf_read (json=True):

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base

    kwargs = {}
    uuid = request.args.get ('uuid', None)
    if uuid: kwargs['uuid'] = uuid
    mime = request.args.get ('mime', None)
    if mime: kwargs['mime'] = mime
    name = request.args.get ('name', None)
    if name: kwargs['name'] = name

    root_uuid = request.args.get ('root_uuid', None)
    if not root_uuid:
        query = base.subleafs
    else:
        root = Q (Node.query).one (uuid=root_uuid)
        query = root.leafs

    leafs = Q (query).all (**kwargs)
    leaf2exts = map (leaf2ext, leafs)

    result = dict (success=True, results=leaf2exts)
    return jsonify (result) if json else result

def leaf_update (json=True):

    if not request.is_xhr:
        request.json = request.args

    root_uuid = request.json.get ('root_uuid', None)
    assert root_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name is not None

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    leaf = Q (base.subleafs).one (uuid=uuid)
    assert leaf

    if leaf.root and leaf.root.uuid != root_uuid:
        leaf.root = Q (base.subnodes).one (uuid=root_uuid)
        assert leaf.root

    if mime and leaf.mime != mime: leaf.mime = mime
    if name and leaf.name != name: leaf.name = name

    db.session.commit ()

    result = dict (success=True, result=leaf2ext (leaf))
    return jsonify (result) if json else result

def leaf_delete (json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid
    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    leaf = Q (base.subleafs).one_or_default (uuid=uuid)
    assert leaf

    db.session.delete (leaf)
    db.session.commit ()

    result = dict (success=True, result=leaf2ext (leaf))
    return jsonify (result) if json else result

###############################################################################
###############################################################################

class PropertyApi (MethodView):

    def post (self, json=True): return property_create (json)
    def get (self, json=True): return property_read (json)
    def put (self, json=True): return property_update (json)
    def delete (self, json=True): return property_delete (json)

rest.add_url_rule ('/property', view_func=PropertyApi.as_view ('properties'))

def property_create (json=True):

    if not request.is_xhr:
        request.json = request.form

    node_uuid = request.json.get ('node_uuid', None)
    assert node_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid or not uuid
    type = request.json.get ('type', None)
    assert type
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name
    data = request.json.get ('data', None)
    assert data or not data

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    node = Q (base.subnodes).one_or_default (uuid=node_uuid)
    assert node

    Type = getattr (sys.modules[__name__], type)
    assert issubclass (Type, Property)
    assert Type.mro ().pop (0) is not Property
    prop = Type (name, data, node, mime=mime, uuid=uuid)

    db.session.add (prop)
    db.session.commit ()

    result = dict (success=True, result=prop2ext (prop))
    return jsonify (result) if json else result

def property_read (json=True):

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base

    kwargs = {}
    uuid = request.args.get ('uuid', None)
    if uuid: kwargs['uuid'] = uuid
    type = request.args.get ('type', None)
    if type: kwargs['type'] = type
    mime = request.args.get ('mime', None)
    if mime: kwargs['mime'] = mime
    name = request.args.get ('name', None)
    if name: kwargs['name'] = name
    data = request.args.get ('data', None)
    if data: kwargs['data'] = data

    node_uuid = request.args.get ('node_uuid', None)
    if not node_uuid:
        query = base.subprops
    else:
        query = base.subprops.join (Node, Property.node) \
            .filter (Node.uuid==node_uuid).back ()

    props = Q (query).all (**kwargs)

    result = dict (success=True, results=map (prop2ext, props))
    return jsonify (result) if json else result

def property_update (json=True):

    if not request.is_xhr:
        request.json = request.args

    node_uuid = request.json.get ('node_uuid', None)
    assert node_uuid
    uuid = request.json.get ('uuid', None)
    assert uuid
    type = request.json.get ('type', None)
    assert type
    mime = request.json.get ('mime', None)
    assert mime
    name = request.json.get ('name', None)
    assert name
    data = request.json.get ('data', None)
    assert data or not data

    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    prop = Q (base.subprops).one (uuid=uuid)
    assert prop

    if prop.node and prop.node.uuid != node_uuid:
        prop.node = Q (base.subnodes).one (uuid=node_uuid)
        assert prop.node

    if type and prop.type != type: pass ## ignore!
    if mime and prop.mime != mime: prop.mime = mime
    if name and prop.name != name: prop.name = name
    if data and prop.data != data: prop.data = data

    db.session.commit ()

    result = dict (success=True, result=prop2ext (prop))
    return jsonify (result) if json else result

def property_delete (json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid
    base = Q (Node.query).one (uuid=session['root_uuid'])
    assert base
    prop = Q (base.subprops).one_or_default (uuid=uuid)
    assert prop

    db.session.delete (prop)
    db.session.commit ()

    result = dict (success=True, result=prop2ext (prop))
    return jsonify (result) if json else result

###############################################################################
###############################################################################

def node2ext (node, leafs=True, level=1):

    assert node
    assert node.uuid
    assert node.name is not None
    assert node.mime
    assert node.root.uuid if node.root else True

    def to_ext (node, results):

        return {
            'expandable': True,
            'expanded': False,
            'leaf': False,
            'loaded': results is not None,
            'mime': node.mime,
            'name': node.name,
            'size': 0,
            'results': results,
            'root_uuid': node.root.uuid if node.root else None,
            'uuid': node.uuid,
            'path': node.path
        }

    if DefaultConfig.MAX_NODE_SIZE < node.nodes.count ():
        return to_ext (node, results=None)

    if DefaultConfig.MAX_NODE_LEVEL < level:
        return to_ext (node, results=None)

    ext_nodes = map (lambda n: node2ext (n, leafs=leafs, level=level+1),
        node.not_leafs)
    ext_leafs = map (lambda l: leaf2ext (l), node.leafs) \
        if leafs else []

    return to_ext (node, results=ext_leafs + ext_nodes)

def leaf2ext (leaf):

    assert leaf
    assert leaf.mime
    assert leaf.name is not None
    assert leaf.root
    assert leaf.root.uuid
    assert leaf.uuid

    return {
        'expandable': False,
        'expanded': False,
        'leaf': True,
        'loaded': True,
        'mime': leaf.mime,
        'name': leaf.name,
        'size': 0,
        'results': None,
        'root_uuid': leaf.root.uuid,
        'uuid': leaf.uuid,
        'path': leaf.path
    }

def prop2ext (prop):

    assert prop
    assert prop.node
    assert prop.node and prop.node.uuid
    assert prop.uuid
    assert prop.type
    assert prop.mime
    assert prop.name
    assert prop.data or not prop.data

    return {
        'node_uuid': prop.node.uuid,
        'uuid': prop.uuid,
        'type': prop.type,
        'mime': prop.mime,
        'name': prop.name,
        'data': prop.data
    }

###############################################################################
###############################################################################

app.register_blueprint (rest)

###############################################################################
###############################################################################
