Ext.define ('Webed.view.LeafList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leaf-list',
    store: 'Leafs',

    requires: [
        'Ext.grid.column.Number',
        'Ext.grid.column.Template',
        'Ext.toolbar.Paging'
    ],

    columns: [{
        flex: 2,
        text: 'Name',
        xtype: 'templatecolumn',
        tpl: '{name}',
        sortable: true
    },{
        flex: 1,
        text: 'Size',
        dataIndex: 'size',
        xtype: 'numbercolumn',
        renderer: Ext.util.Format.fileSize,
        sortable: true,
        align: 'right'
    }],

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Leafs',
        dock: 'bottom',
        displayInfo: false,
        inputItemWidth: 40
    }]
});
