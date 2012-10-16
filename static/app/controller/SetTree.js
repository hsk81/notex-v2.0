Ext.define ('Webed.controller.SetTree', {
    extend: 'Ext.app.Controller',

    views: ['SetTree'],
    models: ['Set', 'Doc', 'Set2Doc'],
    stores: ['Sets', 'Docs', 'Set2Docs'],

    refs: [{
        selector: 'set-tree', ref: 'setTree' // getSetTree: view *instance*
    }],

    init: function () {
        this.control ({
            // TODO: Wire view events!
        });

        this.application.on ({
            synchronize: this.synchronize, scope: this
        });
    },

    synchronize: function () {
        console.debug ('[SetTreeCtrl.synchronize]', this);

        var modelClass = this.getSetModel ();
        assert (modelClass);
        var storeInstance = this.getSetsStore ();
        assert (storeInstance);

        var viewClass = this.getSetTreeView ();
        assert (viewClass);
        var viewInstance = this.getSetTree ();
        assert (viewInstance);
    }
});
