Ext.define ('Webed.store.Nodes', {
    extend: 'Ext.data.TreeStore',
    requires: 'Webed.model.Node',
    model: 'Webed.model.Node',

    sorters: [{
        sorterFn: function (lhs, rhs) {
            var lhs_mime = assert (lhs.get ('mime'));
            var rhs_mime = assert (rhs.get ('mime'));

            if (lhs_mime === rhs_mime) {
                var lhs_name = assert (lhs.get ('name'));
                var rhs_name = assert (rhs.get ('name'));

                if (lhs_name === rhs_name) {
                    var lhs_size = lhs.get ('size');
                    assert (!isNaN(lhs_size));
                    var rhs_size = rhs.get ('size');
                    assert (!isNaN(rhs_size));

                    if (lhs_size === rhs_size) {
                        return 0;
                    } else {
                        return (lhs_size < rhs_size) ? -1 : +1;
                    }
                } else {
                    return (lhs_name < rhs_name) ? -1 : +1;
                }
            } else {
                return (lhs_mime < rhs_mime) ? -1 : +1;
            }
        }
    }],

    root: {
        iconCls: 'icon-node-tree-16',
        uuid_path: ['00000000-0000-0000-0000-000000000000'],
        name_path: ['root'],
        uuid: '00000000-0000-0000-0000-000000000000',
        expanded: true,
        name: 'root',
        mime: 'application/root',
        size: 0
    },

    listeners: {
        append: function (root, record) {
            if (!record.isRoot ()) this.decorate (record);
        },

        beforeload: function (store, operation) {
            var uuid = operation.node.get ('uuid'); assert (uuid);
            store.proxy.setExtraParam ('uuid', uuid);

            //
            // Ensure that expanding (and not yet loaded) nodes do not appear
            // twice within the tree by omitting the top node information.
            //

            operation.params.omit_top = !operation.params.uuid;

            //
            // Stop loading if locked: Simple method to control loading; it
            // allows load *only* if `loadLock` is empty!
            //

            return store.loadLock.empty ();
        }
    },

    decorate: function (node) {
        var mime = assert (node.get ('mime'));
        var icon = assert (MIME.to_icon (mime, '-16'));
        node.set ('iconCls', icon);

        //
        // The `beforeexpand` and `expand` event handler ensure together that
        // the *loading* icon appears for expanding (and not yet loaded) nodes.
        //

        function on_beforeexpand () {
            var loaded = this.get ('loaded');
            if (!loaded) this.set ('iconCls', '');
            this.un ('beforeexpand', on_beforeexpand);
        }

        node.on ('beforeexpand', on_beforeexpand);

        function on_expand () {
            var loaded = this.get ('loaded');
            if (loaded) this.set ('iconCls', icon);
            this.un ('expand', on_expand);
        }

        node.on ('expand', on_expand);
    },

    autoLoad: false,
    loadLock: create_lock ([true])
});
