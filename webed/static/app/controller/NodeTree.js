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

        this.application.on ({
            select_node: this.select_node, scope: this
        });
        this.application.on ({
            select_leaf: this.select_leaf, scope: this
        });

        this.application.on ({
            refresh_tree: this.refresh, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    itemclick: function (view, record, item, index, e, eOpts) {
        this.application.fireEvent ('create_tab', this, {
            record: record
        });

        this.application.fireEvent ('select_leaf', this, {
            record: record
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    select_node: function (source, args) {
        if (source == this) return;
        assert (args && args.record);
        this.set_selection (args.record);
    },

    select_leaf: function (source, args) {
        this.select_node (source, args);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        return semo.getLastSelected ();
    },

    set_selection: function (record) {
        assert (record);

        var uuid = record.get ('uuid');
        assert (uuid);
        var path = record.get ('uuid_path');
        assert (path);
        var path = Ext.clone (path);
        assert (path);

        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);
        var base = view.getRootNode ();
        assert (base);

        // ['aa..aa','bb..bb',..,'ff..ff'] => ['00..00','bb..bb'','ff..ff']
        path[0] = base.get ('uuid'); assert (path[0])
        // ['00..00','bb..bb',..,'ff..ff'] => ['','00..00','bb..bb'']
        path.unshift (''); path.pop ();
        // ['','00..00','bb..bb''] => /00..00/bb..bb
        var path = path.join ('/');
        assert (path);

        view.expandPath (path, 'uuid', '/', function (success, node) {
            if (success) {
                var node = node.findChild ('uuid', uuid, true);
                if (node) semo.select (node);
            }
        }, this);
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

        var node = this.get_selection ();
        assert (node);
        var view = this.getNodeTree ();
        assert (view);
        var base = view.getRootNode ();
        assert (base);
        var base = base.removeAll (false);
        assert (base);
        var store = this.getNodesStore ();
        assert (store);

        var table = view.getView ();
        assert (table);
        table.el.mask ('Loading...');

        store.load ({callback: function (recs, op, success) {
            this.set_selection (node);
            table.el.unmask ();
        }, node: base, scope: this});
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    create_node: function (args) {
        assert (args && args.with);
        assert (args.with.root);

        var node = {
            root_uuid: args.with.root.get ('uuid'),
            uuid: args.with.uuid||UUID.random (),
            uuid_path: args.with.root.get ('uuid_path'),
            name: args.with.name,
            name_path: args.with.root.get ('name_path'),
            mime: args.with.mime,
            size: args.with.size||0
        }

        assert (node.root_uuid);
        assert (node.uuid_path);
        assert (node.uuid);
        assert (node.name_path);
        assert (node.name);
        assert (node.mime);
        assert (node.size >= 0);

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

            $.extend (node, {expandable: true, leaf: false, loaded: true});
        }

        function append_node (node) {
            var root_uuid = node.get ('root_uuid');
            assert (root_uuid);
            var root = get_root.call (this, root_uuid);
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

        //
        // To accelerate append node, a `fake` record/model is created and
        // appended. To avoid later creation it's marked as not a phantom.
        //

        function fake (node) {
            node.uuid_path.push (node.uuid);
            assert (node.uuid_path[node.uuid_path.length - 1] == node.uuid);
            node.name_path.push (node.name);
            assert (node.name_path[node.name_path.length - 1] == node.name);

            var model = Ext.create ('Webed.model.Node', node);
            assert (model); model.phantom = false;
            return model;
        }

        append_node.call (this, fake (node));
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

            $.extend (leaf, {expandable: false, leaf: true, loaded: true});
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

                    var view = this.getNodeTree ();
                    assert (view);
                    var base = view.getRootNode ();
                    assert (base);
                    var semo = view.getSelectionModel ();
                    assert (semo);

                    semo.select (base); // These two select statements seem to
                    semo.select (rec);  // fix an ExtJS bug w.r.t. selection.

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

            var record = record.removeAll (false);
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
