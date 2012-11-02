Ext.define ('Webed.controller.DocList', {
    extend: 'Ext.app.Controller',

    views: ['DocList'],
    models: ['Doc'],
    stores: ['Docs'],

    refs: [{
        selector: 'doc-list', ref: 'docList'
    }],

    init: function () {
        this.control ({
            'doc-list tool[action=refresh]': { click: this.refresh },
            'doc-list tool[action=settings]': { click: this.settings }
        });

        this.application.on ({
            refresh_docs: this.refresh, scope: this
        });
    },

    settings: function () {
        console.debug ('[DocListCtrl.settings]');
    },

    refresh: function () {
        var store = this.getDocsStore ();
        assert (store);
        var store = store.load ();
        assert (store);
    }
});
