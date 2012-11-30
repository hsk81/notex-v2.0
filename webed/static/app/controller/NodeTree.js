Ext.define ('Webed.controller.NodeTree', {
    extend: 'Ext.app.Controller',

    views: ['NodeTree'],
    models: ['Node'],
    stores: ['Nodes'],

    refs: [{
        selector: 'node-tree', ref: 'nodeTree'
    }],

    init: function () {
        this.control ({
            'node-tree': { afterrender: this.select_base },
            'tool[action=node-tree:refresh]': { click: this.refresh },
            'tool[action=node-tree:settings]': { click: this.settings }
        });

        this.application.on ({
            create_node: this.create_node, scope: this
        });
        this.application.on ({
            create_leaf: this.create_leaf, scope: this
        });

        this.application.on ({
            update_node: this.update_node, scope: this
        });
        this.application.on ({
            update_leaf: this.update_leaf, scope: this
        });

        this.application.on ({
            delete_node: this.delete_node, scope: this
        });
        this.application.on ({
            delete_leaf: this.delete_leaf, scope: this
        });
    },

    settings: function () {
        console.debug ('[NodeTreeCtrl.settings]');
    },

    refresh: function () {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);
        var node = semo.getLastSelected ();
        assert (node);
        var path = node.getPath ('uuid', '/');
        assert (path);
        var base = view.getRootNode ();
        assert (base);
        var base = base.removeAll (false);
        assert (base);
        var store = this.getNodesStore ();
        assert (store);
        var mask = view.setLoading (true, true);
        assert (mask);

        var array = path.split ('/');
        assert (array);
        var uuid = array.pop ();
        assert (uuid);
        var path = array.join ('/');
        assert (path||!path);

        var store = store.load ({callback: function (recs, op, success) {
            if (mask) mask.destroy ();
            if (success) {
                view.expandPath (path, 'uuid', '/', function (success, node) {
                    if (success) {
                        var node = node.findChild ('uuid', uuid);
                        assert (node); semo.select (node);
                    }
                }, this);
            }
        }, node: base, scope: this});
        assert (store);
    },

    select_base: function () {
        var view = this.getNodeTree ();
        assert (view);
        var base = view.getRootNode ();
        assert (base);
        var semo = view.getSelectionModel ();
        assert (semo);

        semo.select (base);
    },

    create_node: function (node) {
        var root_uuid = get_root_uuid.call (this, node);
        assert (root_uuid);

        var uuid = node.uuid || UUID.random ();
        assert (uuid);
        var name = node.name || uuid;
        assert (name);
        var size = node.size || 0;
        assert (size >= 0);
        var mime = node.mime;
        assert (mime);

        var node = {
            root_uuid: root_uuid,
            uuid: uuid,
            mime: mime,
            name: name,
            size: size
        }

        var model = Ext.create ('Webed.model.Node', node);
        assert (model);
        var model = model.save (); // TODO: Invoke callback!
        assert (model);

        $.extend (node, {
            expandable: true,
            leaf: false
        });

        var root = get_root.call (this, root_uuid);
        assert (root);
        var node = root.appendChild (node);
        assert (node);

        root.expand (false, function () {
            var view = this.getNodeTree ();
            assert (view);
            var semo = view.getSelectionModel ();
            assert (semo);

            semo.select (node);
            this.refresh ();
        }, this);

        function get_root_uuid (node) {
            if (node.root_uuid) return node.root_uuid;

            var view = this.getNodeTree ();
            assert (view);

            assert (node.mime in {
                'application/project':1, 'application/folder':1
            });

            switch (node.mime) {
                case 'application/project':
                    var base = view.getRootNode ();
                    assert (base);
                    var root_uuid = base.get ('uuid');
                    assert (root_uuid);
                    break;

                case 'application/folder':
                    var semo = view.getSelectionModel ();
                    assert (semo);
                    var record = semo.getLastSelected ();
                    assert (record);
                    var expandable = record.get ('expandable');
                    if (expandable) {
                        var root_uuid = record.get ('uuid');
                        assert (root_uuid);
                    } else {
                        var root_uuid = record.parentNode.get ('uuid');
                        assert (root_uuid);
                    } break;

                default:
                    throw new AssertException (Ext.String.format (
                        'no case for node.mime={0}', node.mime
                    ));
            }

            return root_uuid;
        }

        function get_root (root_uuid) {
            var view = this.getNodeTree ();
            assert (view);
            var base = view.getRootNode ();
            assert (base);

            return (root_uuid != base.get ('uuid'))
                ? base.findChild ('uuid', root_uuid, true)
                : base;
        }
    },

    create_leaf: function (leaf) {
        var root_uuid = get_root_uuid.call (this, leaf);
        assert (root_uuid);

        var uuid = leaf.uuid || UUID.random ();
        assert (uuid);
        var name = leaf.name || uuid;
        assert (name);
        var size = leaf.size || 0;
        assert (size >= 0);
        var mime = leaf.mime;
        assert (mime);

        var leaf = {
            root_uuid: root_uuid,
            uuid: uuid,
            name: name,
            size: size,
            mime: mime
        }

        var model = Ext.create ('Webed.model.Leaf', leaf);
        assert (model);
        var model = model.save (); // TODO: Invoke callback!
        assert (model);

        $.extend (leaf, {
            name: name,
            expandable: false,
            leaf: true
        });

        var root = get_root.call (this, root_uuid);
        assert (root);
        var leaf = root.appendChild (leaf);
        assert (leaf);

        root.expand (false, function () {
            var view = this.getNodeTree ();
            assert (view);
            var semo = view.getSelectionModel ();
            assert (semo);

            semo.select (leaf);
            this.refresh ();
        }, this);

        this.application.fireEvent ('refresh_leafs');

        function get_root_uuid (leaf) {
            if (leaf.root_uuid) return leaf.root_uuid;

            var view = this.getNodeTree ();
            assert (view);
            var semo = view.getSelectionModel ();
            assert (semo);
            var record = semo.getLastSelected ();
            assert (record);

            var expandable = record.get ('expandable');
            if (expandable) {
                var root_uuid = record.get ('uuid');
                assert (root_uuid);
            } else {
                var root_uuid = record.parentNode.get ('uuid');
                assert (root_uuid);
            }

            return root_uuid;
        }

        function get_root (root_uuid) {
            var view = this.getNodeTree ();
            assert (view);
            var base = view.getRootNode ();
            assert (base);

            return (root_uuid != base.get ('uuid'))
                ? base.findChild ('uuid', root_uuid, true)
                : base;
        }
    },

    update_node: function (node, callback, scope) {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        var record = semo.getLastSelected (); // TODO: select-by-uuid option!
        if (record && record.parentNode && node) {
            var strings = record.set (node);
            assert (strings || strings == null);

            var model = record.save ({
                scope: this, success: function (rec, op) {
                    var base = view.getRootNode ();
                    assert (base);

                    semo.select (base);
                    semo.select (rec);

                    if (rec.isLeaf ()) {
                        this.application.fireEvent ('refresh_leafs');
                    }

                    if (callback && callback.call) {
                        callback.call (scope||this, rec, op);
                    }
                }
            });

            assert (model);
        }
    },

    update_leaf: function (leaf, callback, scope) {
        this.update_node (leaf, callback, scope);
    },

    delete_node: function (node, callback, scope) {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        var record = semo.getLastSelected (); // TODO: select-by-uuid option!
        if (record) {
            var refresh_leafs = record.isLeaf () ||
                record.isExpanded () && record.hasChildNodes () ||
                !record.isExpanded () && record.isExpandable ();

            record.destroy ({
                scope: this, callback: function (rec, op) {
                    if (op.success) {
                        if (refresh_leafs) {
                            this.application.fireEvent ('refresh_leafs');
                        }
                    }

                    if (callback && callback.call) {
                        callback.call (scope||this, rec, op);
                    }
                }
            });
        }

        this.select_base ();
    },

    delete_leaf: function (leaf, callback, scope) {
        return this.delete_node (leaf, callback, scope);
    }
});
