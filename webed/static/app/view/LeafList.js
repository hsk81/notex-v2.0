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
        dataIndex: 'name_path',
        sortable: true,
        renderer: function (value, meta, record) {
            if (value) {
                if (value.length > 1) value = value.slice (1);
                return value.join ('/');
            } else {
                return value;
            }
        }
    },{
        flex: 2,
        text: 'Name',
        dataIndex: 'name',
        sortable: true,
        renderer: function (value, meta, record) {
            var path = record.get ('name_path');
            if (path)  {
                if (path.length > 1) path = path.slice (1);
                meta.tdAttr = 'data-qtip="' + path.join ('/') + '"';
            }
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
