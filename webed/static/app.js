Ext.Loader.setConfig ({enabled: true});
Ext.Loader.setPath ({
    'Ext': '../static/lib/extjs/src', 'Webed': '../static/app'
});

Ext.require ('Ext.data.writer.Json');
Ext.require ('Ext.data.reader.Json');
Ext.require ('Webed.store.Nodes');
Ext.require ('Webed.store.Leafs');
Ext.require ('Webed.store.Properties');
Ext.require ('Webed.view.Viewport');

Ext.application ({
    name: 'Webed',
    requires: ['Ext.container.Viewport'],

    models: ['Node', 'Leaf', 'Property'],
    stores: ['Nodes', 'Leafs', 'Properties'],

    controllers: [
        'MainBar', 'NodeTree', 'LeafList', 'ContentTabs', 'StatusBar'
    ],

    paths: {
        'Webed': '../static/app'
    },

    launch: function () {
        Ext.create ('Webed.view.Viewport');
    }
});
