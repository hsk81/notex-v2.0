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
    'Ext.XTemplate',

    'Webed.store.Nodes',
    'Webed.store.Leafs',
    'Webed.store.Properties',
    'Webed.view.Viewport'
]);

Ext.application ({
    name: 'Webed',
    requires: ['Ext.container.Viewport'],

    models: ['Node', 'Leaf', 'Property'],
    stores: ['Nodes', 'Leafs', 'Properties'],

    controllers: [
        'AddFileBox',
        'AddFolderBox',
        'AddProjectBox',
        'ArchiveUploadBox',
        'ContentTabs',
        'DeleteBox',
        'FileUploadBox',
        'Leaf',
        'LeafList',
        'MainBar',
        'Node',
        'NodeTree',
        'Property',
        'PropertyGrid',
        'RenameBox',
        'StatusBar'
    ],

    paths: {
        'Webed': '../static/app'
    },

    launch: function () {
        Ext.create ('Webed.view.Viewport');
    },

    get_selection: function () {
        var controller = this.getController ('NodeTree');
        assert (controller); return controller.get_selection ();
    }
});
