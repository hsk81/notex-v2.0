Ext.define ('Webed.controller.LeafList', {
    extend: 'Ext.app.Controller',

    views: ['LeafList'],
    models: ['Leaf'],
    stores: ['Leafs'],

    refs: [{
        selector: 'leaf-list', ref: 'leafList'
    }],

    init: function () {
        this.control ({
            'leaf-list tool[action=refresh]': { click: this.refresh },
            'leaf-list tool[action=settings]': { click: this.settings }
        });

        this.application.on ({
            refresh_leafs: this.refresh, scope: this
        });
    },

    settings: function () {
        console.debug ('[LeafListCtrl.settings]');
    },

    refresh: function () {
        var store = this.getLeafsStore ();
        assert (store);
        var store = store.load ();
        assert (store);
    }
});
