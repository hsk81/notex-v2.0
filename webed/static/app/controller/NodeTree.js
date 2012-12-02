Ext.define ('Webed.controller.NodeTree', {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    views: ['NodeTree'],
    models: ['Node'],
    stores: ['Nodes'],

    refs: [{
        selector: 'node-tree', ref: 'nodeTree'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    create_node: function (args) {
        assert (args);
        assert (args.node);

        args.opts = $.extend ({model_name: 'Webed.model.Node', node_props: {
            expandable: true, leaf: false
        }}, args.opts);

        var node = {
            mime: args.node.mime,
            name: args.node.name || '',
            root_uuid: get_root_uuid.call (this, args.node),
            size: args.node.size || 0,
            uuid: args.node.uuid || UUID.random ()
        }

        assert (node.mime);
        assert (node.name);
        assert (node.root_uuid);
        assert (node.size >= 0);
        assert (node.uuid);

        var model = Ext.create (args.opts.model_name, node);
        assert (model);
        var model = model.save ({ scope: this, callback: function (rec, op) {
            if (args.callback && args.callback.call)
                args.callback.call (args.scope||this, rec, op);
        }});
        assert (model);

        $.extend (node, args.opts.node_props);

        var root = get_root.call (this, node.root_uuid);
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

    create_leaf: function (args) {
        assert (args);
        assert (args.leaf);
        args.node = args.leaf;
        args.leaf = undefined;

        args.opts = $.extend ({model_name: 'Webed.model.Leaf', node_props: {
            expandable: false, leaf: true
        }}, args.opts);

        this.create_node (args);
        this.application.fireEvent ('refresh_leafs');
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_node: function (args) {
        assert (args);
        assert (args.node);

        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        function callback (record) {
            if (!record) return;
            if (!record.parentNode) return;

            var strings = record.set (args.node);
            assert (strings || strings == null);

            var model = record.save ({
                scope: this, callback: function (rec, op) {
                    var base = view.getRootNode ();
                    assert (base);

                    semo.select (base);
                    semo.select (rec);

                    if (rec.isLeaf ())
                        this.application.fireEvent ('refresh_leafs');
                    if (args.callback && args.callback.call)
                        args.callback.call (args.scope||this, rec, op);
                }
            });

            assert (model);
        }

        if (args.node.path) {
            view.expandPath (args.node.path, 'uuid', '/',
                function (success, node) { callback.call (
                    this, (success) ? node : semo.getLastSelected ()
                );}, this
            );
        } else {
            callback.call (this, semo.getLastSelected ());
        }
    },

    update_leaf: function (args) {
        assert (args);
        assert (args.leaf);
        args.node = args.leaf;
        args.leaf = undefined;

        this.update_node (args);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    delete_node: function (args) {
        assert (args);
        assert (args.node);

        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        function callback (record) {
            if (!record) return;

            var refresh_leafs = record.isLeaf () ||
                record.isExpanded () && record.hasChildNodes () ||
                !record.isExpanded () && record.isExpandable ();

            record.destroy ({
                scope: this, callback: function (rec, op) {
                    if (op.success && refresh_leafs)
                        this.application.fireEvent ('refresh_leafs');
                    if (args.callback && args.callback.call)
                        args.callback.call (args.scope||this, rec, op);
                }
            });

            this.select_base ();
        }

        if (args.node.path) {
            view.expandPath (args.node.path, 'uuid', '/',
                function (success, node) { callback.call (
                    this, (success) ? node : semo.getLastSelected ()
                );}, this
            );
        } else {
            callback.call (this, semo.getLastSelected ());
        }
    },

    delete_leaf: function (args) {
        assert (args);
        assert (args.leaf);
        args.node = args.leaf;
        args.leaf = undefined;

        return this.delete_node (args);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
