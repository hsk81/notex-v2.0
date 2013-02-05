Ext.define ('Webed.view.DeleteBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.delete-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-delete-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Delete',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: '4',

        items: [{
            xtype: 'triggerfield',
            emptyText: 'Delete by name and/or regex ..',
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

    buttons: [{
        text: 'Delete',
        iconCls: 'icon-tick-16',
        action: 'confirm'
    },{
        text: 'Cancel',
        iconCls: 'icon-cross-16',
        action: 'cancel'
    }]
});
