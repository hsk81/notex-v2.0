Ext.apply (Ext.form.field.VTypes, {
    natural: function (value) { return /^(?:\d+)$/.test (value); },
    naturalText: 'Not a positive number.',
    naturalMask: /\d/i
});

Ext.define ('Webed.window.InsertPictureBox', {
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
    width: 360,

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyPadding: '4px 4px 0 4px',

        items: [{
            allowBlank: false,
            displayField: 'full_path',
            emptyText: 'Select a file ..',
            forceSelection: true,
            name: 'path',
            queryMode: 'remote',
            typeAhead: true,
            width: '100%',
            xtype: 'combobox',

            store: Ext.create ('Ext.data.Store', {
                model: 'Webed.model.Leaf',
                filters: [{property: 'mime', regex: /^image\/(?:[^/]+)$/}],
                remoteFilter: true,
                sorters: [{property: 'name_path'}],
                remoteSort: true,
                autoLoad: true,

                listeners: {
                    beforeload: function (store) {
                        return store.loadLock.empty ();
                    },

                    load: function (store, records, successful) {
                        if (records && successful) records.forEach (
                            function (record) { this.decorate (record);}, this
                        );
                    }
                },

                decorate: function (leaf) {
                    var mime = assert (leaf.get ('mime'));
                    var icon = assert (MIME.to_icon (mime, '-16'));
                    leaf.set ('iconCls', icon);
                    var name_path = assert (leaf.get ('name_path'));
                    var node_path = name_path.slice (+1,-1).join ('/');
                    leaf.set ('node_path', node_path);
                    var full_path = name_path.slice (+1).join ('/');
                    leaf.set ('full_path', full_path);
                },

                loadLock: create_lock ([true])
            }),

            tpl: [
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{node_path}',
                    '<div class="w-boundlist-item">',
                        '<ul>',
                        '<li class="w-boundlist-item-text">{name}</li>',
                        '<li class="w-boundlist-item-icon {iconCls}"></li>',
                        '</ul>',
                    '</div>',
                    '</div>',
                '</tpl>'
            ]
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
