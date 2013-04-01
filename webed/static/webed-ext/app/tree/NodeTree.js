Ext.define ('Webed.tree.NodeTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.node-tree',
    store: 'Nodes',

    requires: [
        'Ext.grid.column.Number',
        'Ext.grid.column.Template'
    ],

    singleExpand: true,
    rootVisible: false,
    hideHeaders: false,
    fields: ['name', 'size'],

    columns: [{
        dataIndex: 'name',
        flex: 5,
        text: 'Name',
        sortable: true,
        xtype: 'treecolumn'
    },{
        dataIndex: 'mime',
        flex: 4,
        hidden: true,
        sortable: true,
        text: 'Mime'
    },{
        align: 'right',
        dataIndex: 'size',
        flex: 2,
        renderer: Ext.util.Format.fileSize,
        sortable: true,
        text: 'Size',
        xtype: 'numbercolumn'
    }]
});
