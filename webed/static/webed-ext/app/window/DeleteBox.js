Ext.define ('Webed.window.DeleteBox', {
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
        bodyPadding: '4px',

        items: [{
            xtype: 'textfield',
            readOnly: true,
            tabIndex: -1,
            width: '100%'
        }]
    }],

    buttons: [{
        text: 'Delete',
        iconCls: 'icon-delete-16',
        action: 'confirm'
    },{
        text: 'Cancel',
        iconCls: 'icon-cross-16',
        action: 'cancel'
    }],

    config: {
        record: undefined
    },

    constructor: function (config) {
        this.initConfig (config);
        this.callParent (arguments);
        assert (this.getRecord ());
    }
});
