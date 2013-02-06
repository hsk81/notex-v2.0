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
        bodyPadding: '4px',

        items: [{
            xtype: 'textfield',
            allowBlank: false,
            emptyText: 'Enter name ..',
            enableKeyEvents: true,
            width: '100%'
        }]
    }],

    buttons: [{
        text: 'Rename',
        iconCls: 'icon-tick-16',
        action: 'confirm'
    },{
        text: 'Cancel',
        iconCls: 'icon-cross-16',
        action: 'cancel'
    }]
});
