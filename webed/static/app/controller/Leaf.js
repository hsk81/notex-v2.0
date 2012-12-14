Ext.define ('Webed.controller.Leaf', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Leaf'],
    stores: ['Leafs'],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.application.on ({
            set_leaf: this.set_leaf, scope: this
        });

        this.application.on ({
            set_leafs: this.set_leafs, scope: this
        });

        this.application.on ({
            get_leaf: this.get_leaf, scope: this
        });

        this.application.on ({
            get_leafs: this.get_leafs, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    set_leaf: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.leaf);
        assert (args.leaf.root_uuid||true);
        assert (args.leaf.uuid||true);
        assert (args.leaf.mime);
        assert (args.leaf.name != null);

        var model = Ext.create ('Webed.model.Leaf', args.leaf);
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

    set_leafs: function (source, args) {

        assert (args);
        assert (args.leafs && args.leafs.length >= 0);
        assert (args.callback);
        assert (args.scope||this);

        var recs = [], ops = [];
        for (var index in args.leafs) {
            this.set_leaf (source, {
                scope: scope, callback: function (rec, op) {
                    recs.push (rec); ops.push (op);
                    if (recs.length == args.leafs.length) {
                        args.callback.call (args.scope||this, recs, ops);
                    }
                }, leaf: args.leafs[index]
            });
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_leaf: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.leaf);
        assert (args.callback);
        assert (args.scope||this);

        this.get_leafs (source, {
            scope: args.scope||this, callback: function (recs, op) {
                if (recs && recs.length > 0) {
                    assert (recs.length == 1);
                    args.callback.call (args.scope||this, recs[0], op);
                } else {
                    args.callback.call (args.scope||this, null, op);
                }
            }, leaf: args.leaf
        });
    },

    get_leafs: function (source, args) {

        assert (args);
        assert (args.leaf);
        assert (args.callback);
        assert (args.scope||this);

        var store = this.getLeafsStore ();
        assert (store);

        var index = store.findBy (function (rec, id) {
            return and (args.leaf, function (key, value) {
                return rec.get (key) == value
            });
        });

        if (index >= 0) {
            args.callback.call (args.scope||this, [store.getAt (index)], {
                success: true
            });
        } else {
            store.load ({
                params: args.leaf,
                callback: args.callback,
                scope: args.scope||this
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
