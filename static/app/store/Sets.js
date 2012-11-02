Ext.define ('Webed.store.Sets', {
    extend: 'Ext.data.TreeStore',
    requires: 'Webed.model.Set',
    model: 'Webed.model.Set',

    root: {
        uuid: '00000000-0000-0000-0000-000000000000',
        expanded: true,
        name: 'Root',
        size: 0
    },

    listeners: {
        append: function (root, node, index, options) {
            if (node.isRoot ()) {
                node.set ('iconCls', 'icon-tree-16');
            } else {
                var mime = node.get ('mime');
                assert (mime);

                if (mime == 'text/plain')
                    node.set ('iconCls', 'icon-page-16');
                else if (mime == 'application/folder')
                    node.set ('iconCls', 'icon-folder-16');
                else if (mime == 'application/project')
                    node.set ('iconCls', 'icon-report-16');
                else
                    node.set ('iconCls', 'icon-bullet_white-16');
            }
        },

        beforeload: function (store, operation, options) {
            var uuid = operation.node.get ('uuid');
            assert (uuid);
            store.proxy.setExtraParam ('uuid', uuid);
        }
    }
});
