Ext.define ('Webed.window.ConfirmBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.confirm-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-question-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Confirm',
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
        text: 'Confirm',
        iconCls: 'icon-tick-16',
        action: 'confirm'
    },{
        text: 'Cancel',
        iconCls: 'icon-cross-16',
        action: 'cancel'
    }],

    config: {
        value: undefined
    },

    constructor: function (config) {
        this.initConfig (config);
        this.callParent (arguments);
        var textfield = assert (this.down ('textfield'));
        textfield.setValue (assert (this.getValue ()));
    }
});
