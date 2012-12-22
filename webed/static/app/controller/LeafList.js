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
            'leaf-list': { itemclick: this.itemclick }
        });

        this.application.on ({
            refresh_leafs: this.refresh, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    settings: function () {
        console.debug ('[LeafList.settings]');
    },

    refresh: function (args) {
        var store = this.getLeafsStore ();
        assert (store);

        if (args) {
            store.load ({
                scope: args.scope||this, callback: function (recs, op) {
                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, recs, op);
                    }
                }
            });
        } else {
            store.load ();
        }
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
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
