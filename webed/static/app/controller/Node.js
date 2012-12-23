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
            get_node: this.get_node, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    set_node: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.node);
        assert (args.node.length >= 0);

        Ext.Array.each (args.node, function (node, index) {

            assert (node);
            assert (node.root_uuid);
            assert (node.uuid||true);
            assert (node.mime);
            assert (node.name);
            assert (node.size||true);

            if (!node.uuid) node.uuid = UUID.random ();
            if (!node.size) node.size = 0;

            var model = Ext.create ('Webed.model.Node', node);
            assert (model);

            var model = model.save ({
                scope: args.scope||this, callback: function (rec, op) {
                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op, index);
                    }
                }
            });

            assert (model);
        });
    },

    get_node: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.node);
        assert (args.node.length >= 0);
        assert (args.callback);
        assert (args.callback.call);

        var store = this.getNodesStore ();
        assert (store);

        var array = Ext.Array.map (args.node, function () {
            return [];
        });

        store.getRootNode ().cascadeBy (function (node) {
            Ext.Array.each (args.node, function (object, index) {
                Ext.Object.each (object, function (key, value) {
                    if (node.get (key) != value) { index = -1; return false; }
                });

                if (index >= 0) array[index].push (node);
            });
        });

        Ext.Array.each (array, function (recs, index) {
            if (recs.length > 0) {
                args.callback.call (args.scope||this, recs, index);
            } else {
                store.load ({
                    scope: args.scope||this, callback: function (recs) {
                        args.callback.call (args.scope||this, recs, index);
                    }, params: args.node[index]
                });
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
