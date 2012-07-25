Ext.define ('Webed.view.DocList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.doc-list',
    store: 'Docs',

    columns: [{
        flex: 2,
        text: 'Name',
        xtype: 'templatecolumn',
        tpl: '{name}.{ext}',
        sortable: true
    },{
        flex: 1,
        text: 'Size',
        dataIndex: 'size',
        xtype: 'numbercolumn',
        renderer: Ext.util.Format.fileSize,
        sortable: true,
        align: 'right'
    }]
});
