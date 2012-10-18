(function () {

    function append (root, node, index, options) {
        if (node.isRoot ()) {
            node.set ('iconCls', 'icon-tree');
        } else {
            var ruid = node.get ('root_uuid');
            assert (ruid);
            var uuid = node.get ('uuid');
            assert (uuid);
            var name = node.get ('name');
            assert (name);
            var size = node.get ('size');
            assert (size >= 0);
            var leaf = node.get ('leaf');
            assert (leaf == true || leaf == false);

            if (node.isLeaf ())
                node.set ('iconCls', 'icon-page');
            else if (root.isRoot ())
                node.set ('iconCls', 'icon-report');
            else
                node.set ('iconCls', 'icon-folder');

        }
    }

    Ext.define ('Webed.store.Sets', {
        extend: 'Ext.data.TreeStore',
        requires: 'Webed.model.Set',
        model: 'Webed.model.Set',

        root: {
            expanded: true,
            name: 'Root',
            size: 0,
            uuid: '00000000-0000-0000-0000-000000000000'
        },

        listeners: {
            append: append
        }
    });
})();
