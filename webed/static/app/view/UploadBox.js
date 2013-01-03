Ext.define ('Webed.view.UploadBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.upload-box',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.File'
    ],

    border: false,
    iconCls: 'icon-folder_page-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Open File',
    width: 320,

    items: [{
        xtype: 'form',
        border: false,
        layout: 'fit',

        items: [{
            border: false,
            xtype: 'filefield',
            allowBlank: false,
            anchor: '100%',
            buttonText: 'Select..',
            msgTarget: 'none',
            name: 'file'
        }]
    }],

    buttons: [{
        text: 'Upload',
        iconCls : 'icon-tick-16',
        action: 'confirm'
    },{
        text : 'Cancel',
        iconCls : 'icon-cross-16',
        action: 'cancel'
    }]
});
