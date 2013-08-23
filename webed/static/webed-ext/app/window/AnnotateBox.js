Ext.define ('Webed.window.AnnotateBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.annotate-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-save_as-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Annotate',
    width: 360,

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyPadding: '4px',

        items: [{
            xtype: 'textfield',
            readOnly: true,
            width: '100%'
        },{
            xtype: 'textarea',
            emptyText: 'Enter annotation (commit message) ..',
            width: '100%',
            height: 64,
            margin: 0
        }]
    }],

    buttons: [{
        text: 'Annotate',
        iconCls: 'icon-tick-16',
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
