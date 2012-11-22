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
        this.application.on ({
            create_doc: this.create_doc, scope: this
        });

        this.application.on ({
            update_set: this.update_set, scope: this
        });
        this.application.on ({
            update_doc: this.update_doc, scope: this
        });

        this.application.on ({
            delete_set: this.delete_set, scope: this
        });
        this.application.on ({
            delete_doc: this.delete_doc, scope: this
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
        var mask = view.setLoading (true, true);
        assert (mask);
        store.on ('load', function () {
            if (mask) { mask.destroy (); }
        }, this);
        var store = store.load ({node: base});
        assert (store);

        this.select_base ();
    },

    select_base: function () {
        var view = this.getSetTree ();
        assert (view);
        var base = view.getRootNode ();
        assert (base);
        var semo = view.getSelectionModel ();
        assert (semo);

        semo.select (base);
    },

    create_set: function (set) {
        var root_uuid = get_root_uuid.call (this, set);
        assert (root_uuid);

        var uuid = set.uuid || UUID.random ();
        assert (uuid);
        var name = set.name || uuid;
        assert (name);
        var size = set.size || 0;
        assert (size >= 0);
        var mime = set.mime;
        assert (mime);

        var node = {
            root_uuid: root_uuid,
            uuid: uuid,
            mime: mime,
            name: name,
            size: size
        }

        var model = Ext.create ('Webed.model.Set', node);
        assert (model);
        var model = model.save ();
        assert (model);

        $.extend (node, {
            expandable: true,
            leaf: false
        })

        var root = get_root.call (this, root_uuid);
        assert (root);
        var node = root.appendChild (node);
        assert (node);

        root.expand (false, function () {
            var view = this.getSetTree ();
            assert (view);
            var semo = view.getSelectionModel ();
            assert (semo);

            semo.select (node);
        }, this);

        function get_root_uuid (set) {
            if (set.root_uuid) return set.root_uuid;

            var view = this.getSetTree ();
            assert (view);

            assert (set.mime in {
                'application/project':1, 'application/folder':1
            });

            switch (set.mime) {
                case 'application/project':
                    var base = view.getRootNode ();
                    assert (base);
                    var root_uuid = base.get ('uuid');
                    assert (root_uuid);
                    break;

                case 'application/folder':
                    var semo = view.getSelectionModel ();
                    assert (semo);
                    var record = semo.getLastSelected ();
                    assert (record);
                    var expandable = record.get ('expandable');
                    if (expandable) {
                        var root_uuid = record.get ('uuid');
                        assert (root_uuid);
                    } else {
                        var root_uuid = record.parentNode.get ('uuid');
                        assert (root_uuid);
                    } break;

                default:
                    throw new AssertException (Ext.String.format (
                        'no case for set.mime={0}', set.mime
                    ));
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
    },

    create_doc: function (doc) {
        var root_uuid = get_root_uuid.call (this, doc);
        assert (root_uuid);

        var uuid = doc.uuid || UUID.random ();
        assert (uuid);
        var name = doc.name || uuid;
        assert (name);
        var size = doc.size || 0;
        assert (size >= 0);
        var mime = doc.mime;
        assert (mime);

        var node = {
            root_uuid: root_uuid,
            uuid: uuid,
            name: name,
            size: size,
            mime: mime
        }

        var model = Ext.create ('Webed.model.Doc', node);
        assert (model);
        var model = model.save ();
        assert (model);

        $.extend (node, {
            name: name,
            expandable: false,
            leaf: true
        });

        var root = get_root.call (this, root_uuid);
        assert (root);
        var node = root.appendChild (node);
        assert (node);

        root.expand (false, function () {
            var view = this.getSetTree ();
            assert (view);
            var semo = view.getSelectionModel ();
            assert (semo);

            semo.select (node);
        }, this);

        this.application.fireEvent ('refresh_docs');

        function get_root_uuid (doc) {
            if (doc.root_uuid) return doc.root_uuid;

            var view = this.getSetTree ();
            assert (view);
            var semo = view.getSelectionModel ();
            assert (semo);
            var record = semo.getLastSelected ();
            assert (record);

            var expandable = record.get ('expandable');
            if (expandable) {
                var root_uuid = record.get ('uuid');
                assert (root_uuid);
            } else {
                var root_uuid = record.parentNode.get ('uuid');
                assert (root_uuid);
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
    },

    update_set: function (set) {
        var view = this.getSetTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        var record = semo.getLastSelected ();
        if (record && set) {
            var strings = record.set (set);
            assert (strings || strings == null);
            var model =  record.save ();
            assert (model);
        }
    },

    update_doc: function (doc) {
        return this.update_set (doc);
    },

    delete_set: function () {
        var view = this.getSetTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);

        var record = semo.getLastSelected ();
        if (record) {
            var refresh_docs =
                record.isLeaf () ||
                    record.isExpanded () && record.hasChildNodes () ||
                    !record.isExpanded () && record.isExpandable ();

            record.destroy ({
                scope: this, callback: function (rec, op) {
                    if (op.success) {
                        if (refresh_docs) {
                            this.application.fireEvent ('refresh_docs');
                        }
                    }
                }
            });
        }

        this.select_base ();
    },

    delete_doc: function () {
        return this.delete_set ();
    }
});
