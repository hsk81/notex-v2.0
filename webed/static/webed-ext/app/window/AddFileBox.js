Ext.define ('Webed.window.AddFileBox', {
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
            xtype: 'textfield',

            validator: function (value) {
                var form = assert (this.up ('form'));
                var combobox = assert (form.down ('combobox'));
                var mime = combobox.getValue ();
                if (mime) {
                    var store = assert (Ext.getStore ('MIMEs'));
                    var record = store.findRecord ('mime', mime);
                    if (record) {
                        var exts = assert (record.get ('exts'));
                        var rx = '\\.(?:{0})$'.format (exts.join ('|'));
                        var tpl = "<b>{0}</b> extension(s) expected";

                        if (!value.match (new RegExp (rx))) {
                            return tpl.format (exts.join (', '));
                        }
                    }
                }

                return true;
            }
        },{
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

Ext.define ('Webed.window.AddFileBoxMime', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.add-file-box-mime',

    allowBlank: false,
    displayField: 'name',
    forceSelection: true,
    queryMode: 'local',
    store: 'MIMEs',
    typeAhead: true,
    valueField: 'mime',

    tpl: [
        '<tpl for=".">',
            '<div class="x-boundlist-item">{name}',
            '<div class="w-boundlist-item">',
                '<ul>',
                '<li class="w-boundlist-item-text">{mime}</li>',
                '<li class="w-boundlist-item-icon {icon}-16"></li>',
                '</ul>',
            '</div>',
            '</div>',
        '</tpl>'
    ],

    initComponent: function () {
        this.callParent (arguments); assert (this.getStore ()).filter ([{
            filterFn: function (record) {
                return MIME.is_text (assert (record.get ('mime')), true)
                    && !assert (record.get ('flag')).hidden;
            }
        }]);
    },

    beforeDestroy: function () {
        assert (this.getStore ()).clearFilter ();
    }
});
