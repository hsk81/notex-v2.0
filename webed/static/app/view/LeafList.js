Ext.define ('Webed.view.LeafList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leaf-list',
    store: 'Leafs',

    requires: [
        'Ext.grid.column.Number',
        'Ext.grid.column.Template'
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
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            xtype: 'triggerfield',
            emptyText: 'Search by name and/or regex ..',
            paramName : 'name_path',
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
            width: '100%',

            initComponent: function () {
                this.callParent  (arguments);
                this.on('specialkey', function (f, e) {
                    if (e.getKey () == e.ESC) this.onTrigger1Click ();
                    if (e.getKey () == e.ENTER) this.onTrigger2Click ();
                }, this);
            },

            onTrigger1Click: function () {
                if (this.hasSearch) {
                    this.setValue ('');
                    this.getStore ().clearFilter ();
                    this.hasSearch = false;
                    this.updateLayout ();
                }
            },

            onTrigger2Click: function () {
                var value = this.getValue ();
                if (value.length > 0) {
                    this.getStore ().clearFilter ();
                    this.getStore ().filter ({
                        property: this.paramName,
                        regex: new RegExp (value, 'i')
                    });

                    this.hasSearch = true;
                    this.updateLayout ();
                }
            },

            getStore: function () {
                if (!this.store) {
                    var result = Ext.ComponentQuery.query ('leaf-list');
                    assert (result && result.length > 0);
                    var leaf_list = result.pop ();
                    this.store = leaf_list.store;
                    assert (this.store);
                }

                return this.store;
            }
        }]
    }],

    collapsed: true
});
