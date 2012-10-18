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
        console.debug ('[SetTree.create-set] set:', set);

        var view = this.getSetTree ();
        assert (view);
        var root = view.getRootNode ();
        assert (root);
        var uuid = set.uuid || UUID.random ();
        assert (uuid);

        var node = {
            root_uuid: set.root_uuid || root.get ('uuid'),
            uuid: uuid,
            name: set.name || uuid,
            size: set.size || 0
        }

        var model = Ext.create ('Webed.model.Set', node);
        assert (model);
        var model = model.save ();
        assert (model);
        var node = root.appendChild (node);
        assert (node);
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
