Ext.define ('Webed.controller.Leaf', {
    extend: 'Ext.app.Controller',

    models: ['Leaf'],
    stores: ['Leafs'],

    init: function () {
        this.application.on ({
            set_leaf: this.set_leaf, scope: this
        });

        this.application.on ({
            get_leaf: this.get_leaf, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    set_leaf: function (source, args) {
        if (source == this) return;

        var store = assert (this.getLeafsStore ());

        assert (args);
        assert (args.leaf);
        assert (args.leaf.length >= 0);

        Ext.Array.each (args.leaf, function (leaf, index) {

            var leaf = $.extend (Ext.clone (leaf), {
                uuid_path: leaf.uuid_path.slice (0),
                name_path: leaf.name_path.slice (0)
            });

            assert (leaf);
            assert (leaf.root_uuid);
            assert (leaf.uuid||true);
            assert (leaf.uuid_path);
            assert (leaf.name);
            assert (leaf.name_path);
            assert (leaf.mime);
            assert (leaf.size||true);

            if (!leaf.uuid) { leaf.uuid = UUID.random (); }
            if (!leaf.size) { leaf.size = 0; }

            leaf.uuid_path.push (leaf.uuid);
            assert (leaf.uuid_path[leaf.uuid_path.length - 1] == leaf.uuid);
            leaf.name_path.push (leaf.name);
            assert (leaf.name_path[leaf.name_path.length - 1] == leaf.name);

            assert (Ext.create ('Webed.model.Leaf', leaf)).save ({
                scope: args.scope||this, callback: function (rec, op) {

                    if (rec && op && op.success) {
                        var models = store.add (rec);
                        assert (models && models.length > 0);
                    }

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op, index);
                    }
                }
            });
        });
    },

    get_leaf: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.leaf);
        assert (args.leaf.length >= 0);
        assert (args.callback);
        assert (args.callback.call);

        var store = this.getLeafsStore ();
        assert (store);

        var array = Ext.Array.map (args.leaf, function () {
            return [];
        });

        store.queryBy (function (leaf) {
            Ext.Array.each (args.leaf, function (object, index) {
                Ext.Object.each (object, function (key, value) {
                    if (leaf.get (key) != value) {
                        index = -1; return false;
                    } return true;
                });

                if (index >= 0) array[index].push (leaf);
            });
        });

        Ext.Array.each (array, function (recs, index) {
            if (recs.length > 0) {
                args.callback.call (args.scope||this, recs, index);
            } else {
                store.load ({
                    scope: args.scope||this, callback: function (recs) {
                        args.callback.call (args.scope||this, recs, index);
                    }, params: args.leaf[index], addRecords: true
                });
            }
        });
    }
});
