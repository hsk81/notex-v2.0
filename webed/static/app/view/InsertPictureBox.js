Ext.apply (Ext.form.field.VTypes, {
    natural: function (value) { return /^(?:\d+)$/.test (value); },
    naturalText: 'Not a positive number.',
    naturalMask: /\d/i
});

Ext.define ('Webed.view.InsertPictureBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.insert-picture-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-picture_add-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Insert Picture',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyPadding: '4px 4px 0 4px',

        items: [{
            allowBlank: false,
            displayField: 'name_path',
            emptyText: 'Select a file ..',
            forceSelection: true,
            name: 'path',
            queryMode: 'local',
            store: [],
            typeAhead: true,
            width: '100%',
            xtype: 'combobox'
        },{
            allowBlank: false,
            emptyText: 'Enter scale [%] ..',
            name: 'scale',
            width: '100%',
            value: 100,
            vtype: 'natural',
            xtype: 'textfield'
        },{
            allowBlank: false,
            forceSelection: true,
            name: 'alignment',
            queryMode: 'local',
            store: ['left', 'center', 'right'],
            width: '100%',
            value: 'center',
            xtype: 'combobox'
        },{
            allowBlank: true,
            emptyText: 'Enter caption (optional) ..',
            name: 'caption',
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
