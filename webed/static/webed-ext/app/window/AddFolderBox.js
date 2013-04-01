Ext.define ('Webed.window.AddFolderBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.add-folder-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-folder_add-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Add Folder',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'fit',
        width: '100%',
        bodyPadding: '4px',

        items: [{
            xtype: 'textfield',
            allowBlank: false,
            enableKeyEvents: true,
            emptyText: 'Enter folder name ..',
            value: 'folder',
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
        record: undefined
    },

    constructor: function (config) {
        this.initConfig (config);
        this.callParent (arguments);
        assert (this.getRecord ());
    }
});
