(function () {
    function append (root, node, index, options) {
        if (node.isRoot ()) {
            node.set ('iconCls', 'icon-tree');
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

            if (node.isLeaf ())
                node.set ('iconCls', 'icon-page');      //TODO: '-16'
            else if (root.isRoot ())
                node.set ('iconCls', 'icon-report');    //TODO: '-16'
            else
                node.set ('iconCls', 'icon-folder');    //TODO: '-16'
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
