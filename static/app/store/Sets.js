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
            assert (node);
            if (node.isRoot ()) {
                node.set ('iconCls', 'icon-tree-16');
            } else {
                var root_uuid = node.get ('root_uuid');
                assert (root_uuid);
                var uuid = node.get ('uuid');
                assert (uuid);
                var name = node.get ('name');
                assert (name);
                var size = node.get ('size');
                assert (size >= 0);
                var leaf = node.get ('leaf');
                assert (leaf == true || leaf == false);
                var cls = node.get ('cls');
                assert (cls);

                if (cls == 'document')
                    node.set ('iconCls', 'icon-page-16');
                else if (cls == 'folder')
                    node.set ('iconCls', 'icon-folder-16');
                else if (cls == 'project')
                    node.set ('iconCls', 'icon-report-16');
                else
                    node.set ('iconCls', 'icon-bullet_white-16');
            }
        },

        beforeload: function (store, operation, options) {
            assert (store);
            assert (operation);
            var uuid = operation.node.get ('uuid');
            assert (uuid);
            store.proxy.setExtraParam ('uuid', uuid);
        }
    }
});
