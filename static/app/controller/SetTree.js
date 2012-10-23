Ext.define ('Webed.controller.SetTree', {
    extend: 'Ext.app.Controller',

    views: ['SetTree'],
    models: ['Set'],
    stores: ['Sets'],

    refs: [{
        selector: 'set-tree', ref: 'setTree'
    }],

    init: function () {
        this.control ({
            'set-tree': { afterrender: this.select_base },
            'tool[action=set-tree:refresh]': { click: this.refresh },
            'tool[action=set-tree:settings]': { click: this.settings }
        });

        this.application.on ({
            create_set: this.create_set, scope: this
        });
    },

    settings: function () {
        console.debug ('[SetTreeCtrl.settings]');
    },

    refresh: function () {
        var view = this.getSetTree ();
        assert (view);
        var base = view.getRootNode ();
        assert (base);
        var base = base.removeAll (false);
        assert (base);

        var store = this.getSetsStore ();
        assert (store);
        var store = store.load ({node: base});
        assert (store);
    },

    select_base: function () {
        var view = this.getSetTree ();
        assert (view);
        var base = view.getRootNode ();
        assert (base);
        var model = view.getSelectionModel ();
        assert (model);
        model.select (base);
    },

    create_set: function create_set (set) {
        var root_uuid = get_root_uuid.call (this, set);
        if (root_uuid == null) return;

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
        var root = get_root.call (this, root_uuid);
        assert (root);
        var node = root.appendChild (node);
        assert (node);

        root.expand (false, function () {
            var view = this.getSetTree ();
            assert (view);
            var model = view.getSelectionModel ();
            assert (model);
            model.select (node);
        }, this);

        function get_root_uuid (set) {
            if (set.root_uuid) return set.root_uuid;
            var view = this.getSetTree ();
            assert (view);

            assert (set.cls in {project:1, folder:1});
            switch (set.cls) {
                case 'project':
                    var base = view.getRootNode ();
                    assert (base);
                    var root_uuid = base.get ('uuid');
                    assert (root_uuid);
                    break;

                case 'folder':
                    var model = view.getSelectionModel ();
                    assert (model);
                    var record = model.getLastSelected ();
                    assert (record);
                    var expandable = record.get ('expandable');
                    if (expandable) {
                        var root_uuid = record.get ('uuid');
                        assert (root_uuid);
                    } else {
                        var root_uuid = record.parentNode.get ('uuid');
                        assert (root_uuid);
                    } break;
            }

            return root_uuid;
        }

        function get_root (root_uuid) {
            var view = this.getSetTree ();
            assert (view);
            var base = view.getRootNode ();
            assert (base);

            return (root_uuid != base.get ('uuid'))
                ? base.findChild ('uuid', root_uuid, true)
                : base;
        }
    }
});
