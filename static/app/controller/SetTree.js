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
            create_set: this.create_set, scope: this
        });

        this.application.on ({
            synchronize: this.synchronize, scope: this
        });
    },

    create_set: function (set) {

        var view = this.getSetTree ();
        assert (view);
        var base = view.getRootNode ();
        assert (base);

        if (set.root_uuid) {
            var root_uuid = set.root_uuid;
            assert (root_uuid);
        }

        else if (set.cls == 'project') {
            var root_uuid = base.get ('uuid');
            assert (root_uuid);
        }

        else if (set.cls == 'folder') {
            var model = view.getSelectionModel ();
            assert (model);
            var record = model.getLastSelected ();
            if (record) {
                var expandable = record.get ('expandable');
                if (expandable) {
                    var root_uuid = record.get ('uuid');
                    assert (root_uuid);
                } else {
                    console.debug ('[SetTreeCtrl] expandable:', expandable);
                    return;
                }
            } else {
                console.debug ('[SetTreeCtrl] record:', record);
                return;
            }
        }

        else {
            console.debug ('[SetTreeCtrl] set.cls:', set.cls);
            return;
        }

        var uuid = set.uuid || UUID.random ();
        assert (uuid);
        var name = set.name || uuid;
        assert (name);
        var size = set.size || 0;
        assert (size >= 0);
        var cls = set.cls;
        assert (cls);

        var node = {
            root_uuid: root_uuid, uuid: uuid, name: name, size: size, cls: cls
        }

        var model = Ext.create ('Webed.model.Set', node);
        assert (model);
        var model = model.save ();
        assert (model);

        var root = (root_uuid != base.get ('uuid'))
            ? base.findChild ('uuid', root_uuid, true)
            : base;
        assert (root);

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
