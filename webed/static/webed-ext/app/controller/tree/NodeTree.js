Ext.define ('Webed.controller.tree.NodeTree', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Node', 'MIME'],
    stores: ['Nodes', 'MIMEs'],

    refs: [{
        selector: 'viewport', ref: 'viewport'
    },{
        selector: 'node-tree', ref: 'nodeTree'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'tool[action=node-tree:refresh]': {
                click: this.refresh
            },
            'node-tree': {
                afterrender: this.afterrender,
                itemclick: this.itemclick
            },
            'viewport panel[name=projects]': {
                beforeexpand: this.beforeexpand,
                expand: this.expand
            },
            'viewport': {
                afterlayout: this.afterlayout
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

    afterrender: function () {
        this.keyMap = Ext.create ('Webed.controller.tree.NodeTree.KeyMap', {
            controller: this
        });

        var tree = assert (this.getNodeTree ());
        tree.el.mask ();

        this.select_base ();
    },

    itemclick: function (self, record) {
        this.application.fireEvent ('create_tab', this, {
            record: record
        });
        this.application.fireEvent ('select_leaf', this, {
            record: record
        });
    },

    beforeexpand: function () {
        if (document.location.pathname != '/home/') {
            var q = Ext.Object.fromQueryString (window.location.search);
            var qs = Ext.Object.toQueryString (Ext.apply (q, {expand: true}));
            window.location.href = '/home/?' + qs;
            return false;
        } else {
            var button = Ext.get ('start-box-button-id');
            if (button) button.fadeOut ();
            return true;
        }
    },

    expand: function () {
        var tree = assert (this.getNodeTree ());
        var root = assert (tree.getRootNode ());

        if (!root.get ('loaded')) {

            tree.el.unmask ();
            tree.setLoading ('Loading ..');

            ///////////////////////////////////////////////////////////////////
            // 1'st expansion: load MIMEs' and Nodes' stores

            assert (this.getMIMEsStore ()).load ({
                scope: this, callback: function (recs, op, success) {
                    if (success) {
                        assert (this.getNodesStore ()).load ({node: root,
                            scope: this, callback: function (recs, op) {
                                TRACKER.event ({
                                    category: 'NodeTree',
                                    action: 'expand',
                                    label: "1'st",
                                    value: (op && op.success) ? 1 : 0
                                });

                                tree.setLoading (false);
                            }
                        });
                    } else {
                        TRACKER.event ({
                            category: 'NodeTree', action: 'expand',
                            label: "1'st", value: 0
                        });

                        tree.setLoading (false);
                    }
                }
            });

            ///////////////////////////////////////////////////////////////////
            // 1'st expansion: Add MainToolbar and Statusbar to UI

            var viewport = assert (this.getViewport ());
            var hbox = assert (viewport.down ('panel[name=hbox]'));

            var toolbar = assert (hbox.addDocked ({
                xtype: 'main-toolbar',
                dock: 'top'
            }).pop ());

            toolbar.getEl ().hide ();
            toolbar.show ();
            toolbar.getEl ().slideIn ('t', {
                easing: 'easeIn'
            });

            var statusbar = assert (hbox.addDocked ({
                xtype: 'webed-statusbar',
                dock: 'bottom'
            }).pop ());

            statusbar.getEl ().hide ();
            statusbar.show ();
            statusbar.getEl ().slideIn ('b', {
                easing: 'easeIn'
            });

            ///////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////

        } else {
            TRACKER.event ({
                category: 'NodeTree', action: 'expand', label: "n'th", value: 1
            });
        }
    },

    afterlayout: function (viewport) {
        if (document.location.pathname == '/home/') {
            var query = Ext.Object.fromQueryString (window.location.search);
            if (query.expand) {
                var projects = viewport.down ('panel[name=projects]');
                if (projects && projects.getCollapsed ()) {
                    projects.expand ();
                }
            }
        }
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
        var view = assert (this.getNodeTree ());
        var semo = assert (view.getSelectionModel ());

        return semo.getLastSelected ();
    },

    set_selection: function (record) {
        assert (record);

        var uuid = assert (record.get ('uuid'));
        var path = assert (record.get ('uuid_path'));
        path = assert (Ext.clone (path));

        var view = assert (this.getNodeTree ());
        var semo = assert (view.getSelectionModel ());
        var root = assert (view.getRootNode ());

        // ['aa..aa','bb..bb',..,'ff..ff'] => ['00..00','bb..bb'','ff..ff']
        path[0] = assert (root.get ('uuid'));
        // ['00..00','bb..bb',..,'ff..ff'] => ['','00..00','bb..bb'']
        path.unshift (''); path.pop ();
        // ['','00..00','bb..bb''] => /00..00/bb..bb
        path = path.join ('/');
        if (path) {
            view.expandPath (path, 'uuid', '/', function (success, node) {
                if (success) {
                    node = node.findChild ('uuid', uuid, true);
                    if (node) semo.select (node);
                }
            }, this);
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    select_base: function () {
        var view = assert (this.getNodeTree ());
        var root = assert (view.getRootNode ());
        var semo = assert (view.getSelectionModel ());

        semo.select (root);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refresh: function (source, args) {
        if (source == this) return;

        var node = assert (this.get_selection ());
        var view = assert (this.getNodeTree ());
        var root = assert (view.getRootNode ());
        var store = assert (this.getNodesStore ());

        view.setLoading ('Loading ..');
        root.removeAll (false);

        store.load ({node: root, scope: this, callback: function (recs, op) {
            if (args && args.callback && args.callback.call) {
                args.callback.call (args.scope||this, recs, op);
            } else {
                this.set_selection (node);
            }

            TRACKER.event ({
                category: 'NodeTree', action: 'refresh',
                value: (op && op.success) ? 1 : 0
            });

            view.setLoading (false);
        }});
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    create_node: function (args) {
        assert (args && args.where);
        assert (args.where.root);

        var node = {
            root_uuid: args.where.root.get ('uuid'),
            uuid: args.where.uuid||UUID.random (),
            uuid_path: args.where.root.get ('uuid_path').slice (0),
            name: args.where.name,
            name_path: args.where.root.get ('name_path').slice (0),
            mime: args.where.mime,
            size: args.where.size||0
        };

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

                    TRACKER.event ({
                        category: 'NodeTree', action: 'create-node',
                        label: (rec) ? rec.get ('mime') : '*/*',
                        value: (op && op.success) ? 1 : 0
                    });

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            node = Ext.apply (node||{}, {
                expandable: true, leaf: false, loaded: true
            });
        }

        function append_node (node) {
            var root_uuid = assert (node.get ('root_uuid'));
            var root = assert (get_root.call (this, root_uuid));
            root.appendChild (node);

            root.expand (false, function () {
                var view = this.getNodeTree ();
                assert (view);
                var semo = view.getSelectionModel ();
                assert (semo); semo.select (node);
            }, this);
        }

        function get_root (root_uuid) {
            var tree = assert (this.getNodeTree ());
            var root = assert (tree.getRootNode ());

            return (root_uuid != root.get ('uuid'))
                ? root.findChild ('uuid', root_uuid, true)
                : root;
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
            model.phantom = false;
            return model;
        }

        append_node.call (this, fake (node));
    },

    create_leaf: function (args) {
        var application = assert (this.application);

        function creator (leaf) {
            application.fireEvent ('set_leaf', this, {
                leaf: [leaf], scope: this, callback: function (rec, op) {
                    if (rec && op && op.success) {
                        var store = application.getStore ('Leafs');
                        assert (store); store.decorate (rec);
                    }

                    TRACKER.event ({
                        category: 'NodeTree', action: 'create-leaf',
                        label: (rec) ? rec.get ('mime') : '*/*',
                        value: (op && op.success) ? 1 : 0
                    });

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            Ext.apply (leaf||{}, {
                expandable: false, leaf: true, loaded: true
            });
        }

        this.create_node (Ext.apply (args||{}, {creator: creator}));
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_node: function (args) {
        assert (args);
        assert (args.node);
        assert (args.to);

        if (args.node instanceof Webed.model.Node) {
            on_get.call (this, args.node);
        } else {
            this.application.fireEvent ('get_node', this, {
                node: [args.node], scope:this, callback: function (recs) {
                    if (recs && recs.length > 0) {
                        for (var idx in recs) {
                            if (recs.hasOwnProperty (idx)) {
                                on_get.call (this, recs[idx]);
                            }
                        }
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

                    var tree = assert (this.getNodeTree ());
                    var root = assert (tree.getRootNode ());
                    var semo = assert (tree.getSelectionModel ());

                    semo.select (root); // These two select statements seem to
                    semo.select (rec);  // fix an ExtJS bug w.r.t. selection.

                    if (args.tracker) {
                        args.tracker.call (this, rec, op);
                    } else {
                        TRACKER.event ({
                            category: 'NodeTree', action: 'update-node',
                            label: (rec) ? rec.get ('mime') : '*/*',
                            value: (op && op.success) ? 1 : 0
                        });
                    }

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            assert (model);
        }
    },

    update_leaf: function (args) {

        function tracker (rec, op) {
            TRACKER.event ({
                category: 'NodeTree', action: 'update-leaf',
                label: (rec) ? rec.get ('mime') : '*/*',
                value: (op && op.success) ? 1 : 0
            });
        }

        this.update_node (Ext.apply (args||{}, {tracker: tracker}));
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    delete_node: function (args) {
        assert (args);
        assert (args.node);

        if (args.node instanceof Webed.model.Node) {
            on_get.call (this, args.node);
        } else {
            this.application.fireEvent ('get_node', this, {
                node: [args.node], scope:this, callback: function (recs) {
                    if (recs && recs.length > 0) {
                        for (var idx in recs) {
                            if (recs.hasOwnProperty (idx)) {
                                on_get.call (this, recs[idx]);
                            }
                        }
                    }
                }
            });
        }

        function on_get (record) {
            assert (record);

            record.removeAll (false);
            record.destroy ({
                scope: this, callback: function (rec, op) {

                    if (args.tracker) {
                        args.tracker.call (this, rec, op);
                    } else {
                        TRACKER.event ({
                            category: 'NodeTree', action: 'delete-node',
                            label: (rec) ? rec.get ('mime') : '*/*',
                            value: (op && op.success) ? 1 : 0
                        });
                    }

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op);
                    }
                }
            });

            this.select_base ();
        }
    },

    delete_leaf: function (args) {

        function tracker (rec, op) {
            TRACKER.event ({
                category: 'NodeTree', action: 'delete-leaf',
                label: (rec) ? rec.get ('mime') : '*/*',
                value: (op && op.success) ? 1 : 0
            });
        }

        return this.delete_node (Ext.apply (args||{}, {tracker: tracker}));
    }
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.define ('Webed.controller.tree.NodeTree.KeyMap', {
    extend: 'Ext.util.KeyMap',

    config: {
        target: Ext.getDoc (),
        controller: null
    },

    constructor: function () {
        this.callParent (arguments);
        assert (this.target);
        assert (this.controller);
    },

    binding: [{
        key: Ext.EventObject.F9,
        defaultEventAction: 'stopEvent',
        handler: function () {
            var controller = assert (this.getController ());
            var tree = assert (controller.getNodeTree ());
            var panel = assert (tree.up ('panel'));

            panel.toggleCollapse ();
        }
    }],

    getController: function () { return this.controller; }
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
