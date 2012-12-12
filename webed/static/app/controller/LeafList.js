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
            'leaf-list tool[action=refresh]': { click: this.refresh },
            'leaf-list tool[action=settings]': { click: this.settings },
            'leaf-list': {
                itemclick: this.itemclick,
                select: this.select
            }
        });

        this.application.on ({
            refresh_leafs: this.refresh, scope: this
        });

        this.application.on ({
            sync_selection: this.sync_selection, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    settings: function () {
        console.debug ('[LeafList.settings]');
    },

    refresh: function () {
        var store = this.getLeafsStore ();
        assert (store);
        var store = store.load ();
        assert (store);
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
            this.select (view, record, index, eOpts);
        }
    },

    select: function (view, record, index, eOpts) {
        this.application.fireEvent ('sync_selection', this, {
            record: record
        });
        this.application.fireEvent ('create_tab', this, {
            record: record
        });
    },

    sync_selection: function (source, args) {
        if (source == this) return;

        assert (args);
        var record = args.record;
        assert (record);

        if (record.isExpandable && record.isExpandable ()) {
            return;
        }

        var uuid = record.get ('uuid');
        assert (uuid);
        var view = this.getLeafList ();
        assert (view);
        var store = this.getLeafsStore ();
        assert (store);

        var index = store.findBy (function (rec) {
            return rec.get ('uuid') == uuid;
        }, this);

        if (index >= 0) {
            var semo = view.getSelectionModel ();
            assert (semo);
            var records = semo.getSelection ();
            assert (records);

            var records = records.filter (function (rec) {
                return rec.get ('uuid') == uuid;
            }, this);

            if (records.length == 0) {
                semo.select (index);
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
