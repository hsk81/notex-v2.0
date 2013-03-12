Ext.Loader.setConfig ({
    enabled: true
});

Ext.Loader.setPath ({
    'Ext': '../static/lib/extjs/src',
    'Webed': '../static/app'
});

Ext.require ([
    'Ext.form.field.VTypes',
    'Ext.data.writer.Json',
    'Ext.data.reader.Json',

    'Webed.store.MIMEs',
    'Webed.store.Nodes',
    'Webed.store.Leafs',
    'Webed.store.Properties',
    'Webed.view.Viewport'
]);

Ext.application ({
    name: 'Webed',
    requires: ['Ext.container.Viewport'],
    models: ['MIME', 'Lingua', 'Node', 'Leaf', 'Property'],
    stores: ['MIMEs', 'Linguas', 'Nodes', 'Leafs', 'Properties'],

    controllers: [
        'AddFileBox',
        'AddFolderBox',
        'AddProjectBox',
        'ArchiveUploadBox',
        'ContentTabs',
        'EditorTab',
        'DeleteBox',
        'FileUploadBox',
        'InsertLinkBox',
        'InsertPictureBox',
        'Leaf',
        'LeafList',
        'MainBar',
        'Node',
        'NodeTree',
        'Property',
        'PropertyGrid',
        'RenameBox',
        'StatusBar',
        'toolbar.TextToolbar',
        'toolbar.RestToolbar'
    ],

    paths: {
        'Webed': '../static/app'
    },

    launch: function () {
        Ext.create ('Webed.view.Viewport');
    },

    get_selection: function () {
        return assert (this.getController ('NodeTree')).get_selection ();
    }
});
