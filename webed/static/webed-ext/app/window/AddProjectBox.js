Ext.define ('Webed.window.AddProjectBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.add-project-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-report_add-16',
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Add Project',
    width: 320,

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyPadding: '4px',

        items: [{
            allowBlank: false,
            enableKeyEvents: true,
            emptyText: 'Enter project name ..',
            name: 'name',
            value: 'Project',
            width: '100%',
            xtype: 'textfield'
        },{
            emptyText: 'Select type ..',
            name: 'mime',
            style: 'margin: 0;',
            value: 'application/project+rest',
            width: '100%',
            xtype: 'add-project-box-mime'
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

Ext.define ('Webed.window.AddProjectBoxMime', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.add-project-box-mime',

    allowBlank: false,
    displayField: 'name',
    forceSelection: true,
    store: 'MIMEs',
    queryMode: 'local',
    valueField: 'mime',
    typeAhead: true,

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
                return MIME.is_project (assert (record.get ('mime')))
                    && !assert (record.get ('flag')).hidden;
            }
        }]);
    },

    beforeDestroy: function () {
        assert (this.getStore ()).clearFilter ();
    }
});
