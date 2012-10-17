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
            'create-set': this['create-set'], scope: this
        });
    },

    'create-set': function (set) {
        console.debug ('[SetTree.create-set]');

        var store = this.getSetsStore ();
        assert (store);

        var model = Ext.create ('Webed.model.Set', set);
        assert (model);

        model.save ();
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
