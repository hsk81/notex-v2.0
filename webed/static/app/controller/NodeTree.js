Ext.define ('Webed.controller.NodeTree', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Node'],
    stores: ['Nodes'],

    refs: [{
        selector: 'node-tree', ref: 'nodeTree'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'tool[action=node-tree:refresh]': { click: this.refresh },
            'tool[action=node-tree:settings]': { click: this.settings },
            'node-tree': {
                afterrender: this.select_base,
                itemclick: this.itemclick
            }
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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    itemclick: function (view, record, item, index, e, eOpts) {
        var semo = view.getSelectionModel ();
        assert (semo);
        var node = semo.getLastSelected ();
        assert (node);

        var lhs_uuid = node.get ('uuid');
        assert (lhs_uuid);
        var rhs_uuid = record.get ('uuid');
        assert (rhs_uuid);

        if (lhs_uuid == rhs_uuid) {
            this.application.fireEvent ('create_tab', this, {
                record: record
            });
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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

    settings: function () {
        console.debug ('[NodeTree.settings]');
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refresh: function () {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);
        var node = semo.getLastSelected ();
        assert (node);
        var base = view.getRootNode ();
        assert (base);
        var base = base.removeAll (false);
        assert (base);
        var store = this.getNodesStore ();
        assert (store);
        var mask = view.setLoading (true, true);
        assert (mask);

        var path = base.getPath ('uuid', '/');
        assert (path);
        var path = path + node.getPath ('uuid', '/');
        assert (path);

        var store = store.load ({callback: function (recs, op, success) {
            if (mask) mask.destroy ();
            if (success) {
                view.expandPath (path, 'uuid', '/', function (success, node) {
                    if (success && node) semo.select (node);
                }, this);
            }
        }, node: base, scope: this});
        assert (store);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    create_node: function (args) {
        assert (args && args.with && args.with.root_uuid);

        var node = {
            root_uuid: args.with.root_uuid,
            mime: args.with.mime,
            name: args.with.name,
            size: args.with.size || 0,
            uuid: args.with.uuid || UUID.random ()
        }

        assert (node.mime);
        assert (node.name);
        assert (node.root_uuid);
        assert (node.size >= 0);
        assert (node.uuid);

        if (args.creator && args.creator.call) {
            args.creator.call (this, node);
        } else {
            this.application.fireEvent ('set_node', this, {
                node: [node], scope: this, callback: function (rec, op) {
                    if (rec && op && op.success) {
                        var store = this.getNodesStore ();
                        assert (store); store.decorate (rec);
                    }

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            $.extend (node, {expandable: true, leaf: false});
        }

        function append_node (node) {
            var root = get_root.call (this, node.root_uuid);
            assert (root);
            var node = root.appendChild (node);
            assert (node);

            root.expand (false, function () {
                var view = this.getNodeTree ();
                assert (view);
                var semo = view.getSelectionModel ();
                assert (semo); semo.select (node);
            }, this);
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

        append_node.call (this, node);
    },

    create_leaf: function (args) {

        function creator (leaf) {
            this.application.fireEvent ('set_leaf', this, {
                leaf: [leaf], scope: this, callback: function (rec, op) {
                    if (rec && op && op.success) {
                        var store = this.application.getStore ('Leafs');
                        assert (store); store.decorate (rec);
                    }

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            $.extend (leaf, {expandable: false, leaf: true});
        }

        this.create_node ($.extend (args, {creator: creator}));
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_node: function (args) {
        assert (args);
        assert (args.for);
        assert (args.to);

        if (args.for instanceof Webed.model.Node) {
            on_get.call (this, args.for);
        } else {
            this.application.fireEvent ('get_node', this, {
                node: [args.for], scope:this, callback: function (recs) {
                    if (recs && recs.length > 0) {
                        for (var idx in recs) on_get.call (this, recs[idx]);
                    }
                }
            });
        }

        function on_get (record) {
            assert (record);

            var strings = record.set (args.to);
            assert (strings && strings.length > 0 || strings == null);

            var model = record.save ({
                scope: this, callback: function (rec, op) {
                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            assert (model);
        }
    },

    update_leaf: function (args) {
        this.update_node (args);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    delete_node: function (args) {
        assert (args);
        assert (args.for);

        if (args.for instanceof Webed.model.Node) {
            on_get.call (this, args.for);
        } else {
            this.application.fireEvent ('get_node', this, {
                node: [args.for], scope:this, callback: function (recs) {
                    if (recs && recs.length > 0) {
                        for (var idx in recs) on_get.call (this, recs[idx]);
                    }
                }
            });
        }

        function on_get (record) {
            assert (record);

            record.destroy ({
                scope: this, callback: function (rec, op) {
                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            this.select_base ();
        }
    },

    delete_leaf: function (args) {
        return this.delete_node (args);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
