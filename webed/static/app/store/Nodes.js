Ext.define ('Webed.store.Nodes', {
    extend: 'Ext.data.TreeStore',
    requires: 'Webed.model.Node',
    model: 'Webed.model.Node',

    root: {
        uuid: '00000000-0000-0000-0000-000000000000',
        expanded: true,
        name: 'Root',
        mime: 'application/root',
        size: 0
    },

    listeners: {
        append: function (root, record, index, options) {
            this.decorate (record);
        },

        beforeload: function (store, operation, options) {
            var uuid = operation.node.get ('uuid');
            assert (uuid);
            store.proxy.setExtraParam ('uuid', uuid);

            //
            // Ensure that expanding (and not yet loaded) nodes do not appear
            // twice within the tree by omitting the top node information.
            //

            if (operation.params.uuid) {
                operation.params.omit_top = false;
            } else {
                operation.params.omit_top = true;
            }
        }
    },

    decorate: function (node) {
        var mime = node.get ('mime');
        assert (mime);
        var icon = MIME.to_icon (mime, '-16');
        assert (icon);

        node.set ('iconCls', icon);

        //
        // The `beforeexpand` and `expand` event handler ensure together that
        // the *loading* icon appears for expanding (and not yet loaded) nodes.
        //

        function on_beforeexpand (self, eOpts) {
            var loaded = this.get ('loaded');
            if (!loaded) this.set ('iconCls', '');
            this.un ('beforeexpand', on_beforeexpand);
        }

        node.on ('beforeexpand', on_beforeexpand);

        function on_expand (self, eOpts) {
            var loaded = this.get ('loaded');
            if (loaded) this.set ('iconCls', icon);
            this.un ('expand', on_expand);
        }

        node.on ('expand', on_expand);
    },

    autoLoad: true
});
