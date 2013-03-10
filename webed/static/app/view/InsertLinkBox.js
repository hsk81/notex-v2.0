Ext.define ('Webed.view.InsertLinkBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.insert-link-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-link_add-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Insert Hyperlink',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyPadding: '4px 4px 0 4px',

        items: [{
            allowBlank: false,
            emptyText: 'Enter URL ..',
            name: 'url',
            width: '100%',
            vtype: 'url',
            xtype: 'textfield'
        },{
            allowBlank: true,
            emptyText: 'Enter label (optional) ..',
            name: 'label',
            width: '100%',
            xtype: 'textfield'
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
    }]
});
