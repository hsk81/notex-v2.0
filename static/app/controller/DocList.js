Ext.define ('Webed.controller.DocList', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'doc-list', ref: 'docList'
    }],

    init: function () {
        this.control ({
            'doc-list tool[action=refresh]': { click: this.refresh },
            'doc-list tool[action=settings]': { click: this.settings }
        });
    },

    settings: function () {
        console.debug ('[DocListCtrl.settings]');
    },

    refresh: function () {
        console.debug ('[DocListCtrl.refresh]');
    }
});
