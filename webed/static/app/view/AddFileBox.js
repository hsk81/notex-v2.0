Ext.define ('Webed.view.AddFileBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.add-file-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-page_white_add-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Add Document',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyPadding: '4px',

        items: [{
            allowBlank: false,
            enableKeyEvents: true,
            emptyText: 'Enter document name ..',
            name: 'name',
            value: 'file.txt',
            width: '100%',
            xtype: 'textfield'
        },{
            allowBlank: false,
            emptyText: 'Select type ..',
            name: 'mime',
            style: 'margin: 0;',
            value: 'text/plain',
            width: '100%',
            xtype: 'add-file-box-mime'
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

Ext.define ('Webed.view.AddFileBoxMime', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.add-file-box-mime',

    store: 'MIMEs',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'mime',
    typeAhead: true,

    tpl: [
        '<tpl for=".">',
        '<tpl if="!hidden">',

            '<div class="x-boundlist-item">{name}',
            '<div class="w-boundlist-item">',
                '<ul>',
                '<li class="w-boundlist-item-text">{mime}</li>',
                '<li class="w-boundlist-item-icon {icon}-16"></li>',
                '</ul>',
            '</div>',
            '</div>',

        '</tpl>',
        '</tpl>'
    ],

    initComponent: function () {
        this.callParent (arguments); assert (this.getStore ()).filter ([{
            filterFn: function (record) {
                return MIME.is_text (assert (record.get ('mime')), true);
            }
        }]);
    },

    beforeDestroy: function () {
        assert (this.getStore ()).clearFilter ();
    }
});
