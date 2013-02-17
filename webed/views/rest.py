__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask.views import MethodView
from flask.globals import request
from flask import Blueprint

from ..ext import db
from ..app import app
from ..models import *
from ..util import Q, JSON, jsonify

import sys

###############################################################################
###############################################################################

rest = Blueprint ('rest', __name__)

###############################################################################
###############################################################################

@rest.route ('/node/root', methods=['GET'])
def node_root (leafs=True, json=True):
    return node_read (leafs=leafs, json=json)

class NodeApi (MethodView):

    def post (self, leafs=True, json=True): return node_create (leafs, json)
    def get (self, leafs=True, json=True): return node_read (leafs, json)
    def put (self, leafs=True, json=True): return node_update (leafs, json)
    def delete (self, leafs=True, json=True): return node_delete (leafs, json)

rest.add_url_rule ('/node', view_func=NodeApi.as_view ('node'))

@db.commit ()
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

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    root = Q (base.subnodes).one_or_default (uuid=root_uuid, default=base)
    assert root

    if uuid:
        node = Node (name, root, mime=mime, uuid=uuid)
    else:
        node = Node (name, root, mime=mime)

    db.nest (fn=lambda: db.session.add (node)) ()
    db.nest (fn=lambda: db.session.add (NodePath (node))) ()
    db.session.execute (db.sql.select ([db.sql.func.npt_delete_node (
        base.id, node.id)]))
    db.session.execute (db.sql.select ([db.sql.func.npt_insert_node (
        base.id, node.id)]))

    result = dict (success=True, result=node2ext (node, leafs=leafs))
    return jsonify (result) if json else result

def node_read (leafs=True, json=True):

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base

    omit_top = request.args.get ('omit_top', False)
    if omit_top: omit_top = JSON.decode (omit_top)

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

    if 'uuid' in kwargs and omit_top:
        node = Q (node_query).one (**kwargs)
        rhs = map (lambda n: node2ext (n, leafs=leafs), node.not_leafs)
        lhs = map (lambda l: leaf2ext (l), node.leafs) if leafs else []
    else:
        nodes = Q (node_query).all (**kwargs)
        lhs = map (lambda n: node2ext (n, leafs=leafs), nodes)
        leafs = Q (leaf_query).all (**kwargs) if leafs else []
        rhs = map (lambda l: leaf2ext (l), leafs)

    result = dict (success=True, results=lhs + rhs)
    return jsonify (result) if json else result

@db.commit ()
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

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    node = Q (base.subnodes).one (uuid=uuid)
    assert node

    if root_uuid == '00000000-0000-0000-0000-000000000000':
        root_uuid = base.uuid

    if node.root and node.root.uuid != root_uuid:
        node.root = Q (base.subnodes).one (uuid=root_uuid)
        assert node.root

    if node.name != name: node.name = name
    if node.mime != mime: node.mime = mime

    db.nest (fn=lambda: db.session.add (node)) ()
    db.session.execute (db.sql.select ([db.sql.func.npt_delete_node (
        base.id, node.id)]))
    db.session.execute (db.sql.select ([db.sql.func.npt_insert_node (
        base.id, node.id)]))

    result = dict (success=True, result=node2ext (node, leafs=leafs))
    return jsonify (result) if json else result

@db.commit ()
def node_delete (leafs=True, json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    node = Q (base.subnodes).one (uuid=uuid)
    assert node

    db.session.delete (node)

    result = dict (success=True, result=node2ext (node, leafs=leafs))
    return jsonify (result) if json else result

###############################################################################
###############################################################################

class LeafApi (MethodView):

    def post (self, json=True): return leaf_create (json)
    def get (self, json=True): return leaf_read (json)
    def put (self, json=True): return leaf_update (json)
    def delete (self, json=True): return leaf_delete (json)

rest.add_url_rule ('/leaf', view_func=LeafApi.as_view ('leafs'))

@db.commit ()
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

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    root = Q (base.subnodes).one_or_default (uuid=root_uuid, default=base)
    assert root

    if uuid:
        leaf = Leaf (name, root, mime=mime, uuid=uuid)
    else:
        leaf = Leaf (name, root, mime=mime)

    db.nest (fn=lambda: db.session.add (leaf)) ()
    db.session.execute (db.sql.select ([db.sql.func.npt_delete_node (
        base.id, leaf.id)]))
    db.session.execute (db.sql.select ([db.sql.func.npt_insert_node (
        base.id, leaf.id)]))

    result = dict (success=True, result=leaf2ext (leaf))
    return jsonify (result) if json else result

def leaf_read (json=True):

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base

    kwargs = {}
    uuid = request.args.get ('uuid', None)
    if uuid: kwargs['uuid'] = uuid
    mime = request.args.get ('mime', None)
    if mime: kwargs['mime'] = mime
    name = request.args.get ('name', None)
    if name: kwargs['name'] = name

    root_uuid = request.args.get ('root_uuid', None)
    if root_uuid:
        root = Q (Node.query).one (uuid=root_uuid)
        query = root.leafs ## TODO: subleafs?
    else:
        query = base.subleafs

    filters = request.args.get ('filters', None)
    if filters:
        for filter in JSON.decode (filters):

            property = filter['property']
            assert property
            regex = filter['regex']
            assert regex
            ignore_case = filter['ignore_case']
            assert ignore_case is not None

            regex_op = '~*' if ignore_case else '~'
            regex = regex[:32] ## cap long regex

            column = getattr (Node, property)
            if column:
                if hasattr (NodePath, property):
                    alias = db.orm.aliased (NodePath)
                    column = getattr (alias, property)
                    query = query.join (alias, alias.node_id==Node.id)

                query = query.filter (column.op (regex_op) (regex))

    sorters = request.args.get ('sort', None)
    if sorters:
        for sorter in JSON.decode (sorters):

            property = sorter['property']
            assert property
            direction = sorter['direction'] if 'direction' in sorter else 'asc'
            assert direction

            column = getattr (Node, property)
            if column:
                if hasattr (NodePath, property):
                    alias = db.orm.aliased (NodePath)
                    column = getattr (alias, property)
                    query = query.join (alias, alias.node_id==Node.id)
                if direction.lower () == 'desc':
                    column = column.desc ()

                query = query.order_by (column)

    start = int (request.args.get ('start', 0))
    limit = int (request.args.get ('limit', 25))

    leafs, total = Q (query).page (offset=start, limit=limit, **kwargs)
    if total > 0 and leafs == []:
        leafs, total = Q (query).page (offset=0, limit=limit, **kwargs)

    leaf2exts = map (leaf2ext, leafs)

    result = dict (success=True, results=leaf2exts, total=total)
    return jsonify (result) if json else result

@db.commit ()
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

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    leaf = Q (base.subleafs).one (uuid=uuid)
    assert leaf

    if root_uuid == '00000000-0000-0000-0000-000000000000':
        root_uuid = base.uuid

    if leaf.root and leaf.root.uuid != root_uuid:
        leaf.root = Q (base.subnodes).one (uuid=root_uuid)
        assert leaf.root

    if mime and leaf.mime != mime: leaf.mime = mime
    if name and leaf.name != name: leaf.name = name

    db.nest (fn=lambda: db.session.add (leaf)) ()
    db.session.execute (db.sql.select ([db.sql.func.npt_delete_node (
        base.id, leaf.id)]))
    db.session.execute (db.sql.select ([db.sql.func.npt_insert_node (
        base.id, leaf.id)]))

    result = dict (success=True, result=leaf2ext (leaf))
    return jsonify (result) if json else result

@db.commit ()
def leaf_delete (json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid
    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    leaf = Q (base.subleafs).one (uuid=uuid)
    assert leaf

    db.session.delete (leaf)

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

@db.commit ()
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
    size = request.json.get ('size', None)
    assert size or not size

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    node = Q (base.subnodes).one_or_default (uuid=node_uuid, default=base)
    assert node

    Type = getattr (sys.modules[__name__], type)
    assert issubclass (Type, Property)
    assert issubclass (TextProperty, DataPropertyMixin)
    prop = Type (name, data, node, mime=mime, uuid=uuid)

    db.nest (fn=lambda: db.session.add (prop))

    result = dict (success=True, result=prop2ext (prop))
    return jsonify (result) if json else result

def property_read (json=True):

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
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
    assert not data ## since no DB index
    size = request.args.get ('size', None)
    assert not size ## since no DB column

    node_uuid = request.args.get ('node_uuid', None)
    if node_uuid:
        node = Q (base.subnodes).one (uuid=node_uuid)
        query = node.props ## TODO: subprops?
    else:
        query = base.subprops

    props = Q (query).all (**kwargs)

    result = dict (success=True, results=map (prop2ext, props))
    return jsonify (result) if json else result

@db.commit ()
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
    size = request.json.get ('size', None)
    assert size or not size

    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    prop = Q (base.subprops).one (uuid=uuid)
    assert prop

    if node_uuid == '00000000-0000-0000-0000-000000000000':
        node_uuid = base.uuid

    if prop.node and prop.node.uuid != node_uuid:
        prop.node = Q (base.subnodes).one (uuid=node_uuid)
        assert prop.node

    if type and prop.type != type: pass ## ignore!
    if mime and prop.mime != mime: prop.mime = mime
    if name and prop.name != name: prop.name = name
    if data and prop.data != data: prop.data = data
    if size and prop.size != size: pass ## ignore!

    result = dict (success=True, result=prop2ext (prop))
    return jsonify (result) if json else result

@db.commit ()
def property_delete (json=True):

    if not request.is_xhr:
        request.json = request.args

    uuid = request.json.get ('uuid', None)
    assert uuid
    base = Q (Node.query).one (uuid=app.session_manager.anchor)
    assert base
    prop = Q (base.subprops).one (uuid=uuid)
    assert prop

    db.session.delete (prop)

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
            'size': node.get_size (name='data'),
            'results': results,
            'root_uuid': node.root.uuid if node.root else None,
            'uuid': node.uuid,
            'uuid_path': node.get_path (field='uuid'),
            'name_path': node.get_path (field='name')
        }

    if app.config['MAX_NODE_SIZE'] < node.nodes.count ():
        return to_ext (node, results=None)

    if app.config['MAX_NODE_LEVEL'] < level:
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
        'size': leaf.get_size (name='data'),
        'results': None,
        'root_uuid': leaf.root.uuid,
        'uuid': leaf.uuid,
        'uuid_path': leaf.get_path (field='uuid'),
        'name_path': leaf.get_path (field='name')
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
    assert prop.size >= 0 if prop.data else True

    return {
        'node_uuid': prop.node.uuid,
        'uuid': prop.uuid,
        'type': prop.type,
        'mime': prop.mime,
        'name': prop.name,
        'data': prop.data,
        'size': prop.size
    }

###############################################################################
###############################################################################

app.register_blueprint (rest)

###############################################################################
###############################################################################
