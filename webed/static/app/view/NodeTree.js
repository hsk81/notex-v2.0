Ext.define ('Webed.view.NodeTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.node-tree',
    store: 'Nodes',

    useArrows: true,
    rootVisible: false,
    hideHeaders: false,
    fields: ['name', 'size'],

    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        dataIndex: 'name',
        flex: 2,
        sortable: true
    },{
        xtype: 'numbercolumn',
        renderer: Ext.util.Format.fileSize,
        text: 'Size',
        dataIndex: 'size',
        flex: 1,
        sortable: true,
        align: 'right'
    }]
});
