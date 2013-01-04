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
    title: 'Upload',
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

Ext.apply (Ext.form.field.VTypes, {
    fileText: "File expected",
    fileMask: /\w\d\s\./i,
    file: function (value, field) {
        return /^.+$/i.test (value);
    }
});

Ext.define ('Webed.view.FileUploadBox', {
    extend: 'Webed.view.UploadBox',
    alias: 'widget.file-upload-box',
    title: 'Upload File',

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
            name: 'file',
            vtype: 'file'
        }]
    }]
});

Ext.apply (Ext.form.field.VTypes, {
    zipArchiveText: "ZIP Archive expected",
    zipArchiveMask: /\w\d\s\./i,
    zipArchive: function (value, field) {
        return /^.+\.zip$/i.test (value);
    }
});

Ext.define ('Webed.view.ArchiveUploadBox', {
    extend: 'Webed.view.UploadBox',
    alias: 'widget.archive-upload-box',
    title: 'Upload Archive',

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
            name: 'file',
            vtype: 'zipArchive'
        }]
    }]
});
