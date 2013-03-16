Ext.define ('Webed.view.LeafList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leaf-list',
    store: 'Leafs',

    requires: [
        'Ext.grid.column.Number',
        'Ext.grid.column.Template'
    ],

    columns: [{
        dataIndex: 'name_path',
        flex: 5,
        sortable: true,
        text: 'Path',
        renderer: function (value, meta, record) {
            if (value) {
                if (value.length > 1) value = value.slice (1);
                return value.join ('/');
            } else {
                return value;
            }
        }
    },{
        dataIndex: 'name',
        flex: 5,
        hidden: true,
        sortable: true,
        text: 'Name',
        renderer: function (value, meta, record) {
            var path = record.get ('name_path');
            if (path)  {
                if (path.length > 1) path = path.slice (1);
                meta.tdAttr = 'data-qtip="' + path.join ('/') + '"';
            }
            return value;
        }
    },{
        dataIndex: 'mime',
        flex: 4,
        hidden: true,
        text: 'Mime',
        sortable: true
    },{
        align: 'right',
        dataIndex: 'size',
        flex: 2,
        renderer: Ext.util.Format.fileSize,
        sortable: false,
        text: 'Size',
        xtype: 'numbercolumn'
    }],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            xtype: 'triggerfield',
            emptyText: 'Search name or regex ..',
            paramName : 'name_path',
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
            width: '100%',

            minLength: 3,
            maxLength: 32,

            initComponent: function () {
                this.callParent  (arguments);
                this.on('specialkey', function (f, e) {
                    if (e.getKey () == e.ESC) this.onTrigger1Click ();
                    if (e.getKey () == e.ENTER) this.onTrigger2Click ();
                }, this);
            },

            onTrigger1Click: function () {
                if (this.search) {
                    this.search = null;
                    this.setValue ('');
                    var store = this.getStore (); assert (store);
                    store.clearFilter (true); Ext.Function.defer(function() {
                        store.load (); //Firefox timing issue fix!
                    }, 25);
                }
            },

            onTrigger2Click: function () {
                var value = this.getValue ();
                if (this.isValid () && value != this.search) {
                    this.search = value;
                    var store = this.getStore (); assert (store);
                    store.clearFilter (true); store.filter ({
                        property: this.paramName,
                        regex: new RegExp (value, 'i')
                    });
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
            },

            listeners: {
                afterrender: function (self, eOpts) {
                    self.inputEl.set ({spellcheck:false});
                }
            }
        }]
    }],

    collapsed: true
});
