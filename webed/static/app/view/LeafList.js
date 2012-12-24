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
        text: 'Path',
        dataIndex: 'path',
        sortable: true,
        renderer: function (value, meta, record) {
            return (value) ? value.slice (1).join ('/') : value;
        }
    },{
        flex: 2,
        text: 'Name',
        dataIndex: 'name',
        sortable: true,
        renderer: function (value, meta, record) {
            var path = record.get ('path');
            if (path)
                meta.tdAttr = 'data-qtip="' + path.slice (1).join ('/') + '"';
            return value;
        }, hidden: true
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
