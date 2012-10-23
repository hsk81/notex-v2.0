Ext.define ('Webed.view.SetTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.set-tree',
    store: Ext.create ('Webed.store.Sets'),

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
