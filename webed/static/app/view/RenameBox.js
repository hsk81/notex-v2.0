Ext.define ('Webed.view.RenameBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.rename-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-pencil-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Rename',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: '4',

        items: [{
            xtype: 'textfield',
            width: '100%',
            allowBlank: false,
            enableKeyEvents: true
        }]
    }],

    buttons: [{
        text: 'Rename',
        iconCls: 'icon-pencil-16',
        action: 'confirm'
    },{
        text: 'Cancel',
        iconCls: 'icon-cross-16',
        action: 'cancel'
    }]
});
