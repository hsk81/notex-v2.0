Ext.define ('Webed.controller.LeafList', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Leaf'],
    stores: ['Leafs'],

    refs: [{
        selector: 'leaf-list', ref: 'leafList'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'leaf-list tool[action=leaf-list:refresh]': {
                click: this.refresh
            },
            'leaf-list': {
                itemclick: this.itemclick,
                expand: this.expand
            }
        });

        this.application.on ({
            select_leaf: this.select_leaf, scope: this
        });

        this.application.on ({
            reload_leaf: this.reload_leaf, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    select_leaf: function (source, args) {
        if (source == this) return;
        assert (args && args.record);
        this.set_selection (args.record);
    },

    reload_leaf: function (source, args) {
        if (source == this) return;
        assert (args && args.record);

        var uuid = args.record.get ('uuid');
        assert (uuid);
        var view = this.getLeafList ();
        assert (view);
        var store = this.getLeafsStore ();
        assert (store);

        var collection = store.queryBy (function (leaf) {
            return leaf.get ('uuid') == uuid;
        });

        if (collection && collection.length > 0) {
            store.reload ({
                scope: this, callback: function () {
                    this.select_leaf (source, args);
                }
            });
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        var view = this.getLeafList ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        return semo.getLastSelected ();
    },

    set_selection: function (record) {
        assert (record);
        var uuid = record.get ('uuid');
        assert (uuid);

        var view = this.getLeafList ();
        assert (view);
        var store = this.getLeafsStore ();
        assert (store);

        var collection = store.queryBy (function (leaf) {
            return leaf.get ('uuid') == uuid;
        });

        if (collection && collection.length > 0) {
            var leaf = collection.items[0];
            assert (leaf);
            var table = view.getView ();
            assert (table);

            table.select (leaf);
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refresh: function () {
        var view = this.getLeafList ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);
        var store = this.getLeafsStore ();
        assert (store);

        store.load ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    itemclick: function (view, record, item, index, e, eOpts) {
        this.application.fireEvent ('create_tab', this, {
            record: record
        });
        this.application.fireEvent ('select_node', this, {
            record: record
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    expand: function (panel, eOpts) {
        var store = this.getLeafsStore ();
        assert (store);
        var total = store.getTotalCount ();
        assert (total >= 0);
        if (total == 0) {
            store.load ();
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
