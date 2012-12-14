Ext.define ('Webed.controller.Node', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Node'],
    stores: ['Nodes'],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.application.on ({
            set_node: this.set_node, scope: this
        });

        this.application.on ({
            set_nodes: this.set_nodes, scope: this
        });

        this.application.on ({
            get_node: this.get_node, scope: this
        });

        this.application.on ({
            get_nodes: this.get_nodes, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    set_node: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.node);
        assert (args.node.root_uuid||true);
        assert (args.node.uuid||true);
        assert (args.node.mime);
        assert (args.node.name != null);

        var model = Ext.create ('Webed.model.Node', args.node);
        assert (model);

        var model = model.save ({
            scope: args.scope||this, callback: function (rec, op) {
                if (args.callback && args.callback.call) {
                    args.callback.call (args.scope||this, rec, op);
                }
            }
        });

        assert (model);
    },

    set_nodes: function (source, args) {

        assert (args);
        assert (args.nodes && args.nodes.length >= 0);
        assert (args.callback);
        assert (args.scope||this);

        var recs = [], ops = [];
        for (var index in args.nodes) {
            this.set_node (source, {
                scope: scope, callback: function (rec, op) {
                    recs.push (rec); ops.push (op);
                    if (recs.length == args.nodes.length) {
                        args.callback.call (args.scope||this, recs, ops);
                    }
                }, node: args.nodes[index]
            });
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_node: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.node);
        assert (args.callback);
        assert (args.scope||this);

        this.get_nodes (source, {
            scope: args.scope||this, callback: function (recs, op) {
                if (recs && recs.length > 0) {
                    assert (recs.length == 1);
                    args.callback.call (args.scope||this, recs[0], op);
                } else {
                    args.callback.call (args.scope||this, null, op);
                }
            }, node: args.node
        });
    },

    get_nodes: function (source, args) {

        assert (args);
        assert (args.node);
        assert (args.callback);
        assert (args.scope||this);

        var store = this.getNodesStore ();
        assert (store);

        var index = store.findBy (function (rec, id) {
            return and (args.node, function (key, value) {
                return rec.get (key) == value
            });
        });

        if (index >= 0) {
            args.callback.call (args.scope||this, [store.getAt (index)], {
                success: true
            });
        } else {
            store.load ({
                params: args.node,
                callback: args.callback,
                scope: args.scope||this
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
