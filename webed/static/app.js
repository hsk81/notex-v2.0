Ext.Loader.setConfig ({enabled: true});
Ext.Loader.setPath ({'Ext': '../static/lib/extjs/src'});

Ext.application ({
    name: 'Webed',
    requires: ['Ext.container.Viewport'],

    models: ['Node', 'Leaf', 'Resource'],
    stores: ['Nodes', 'Leafs', 'Resources'],

    controllers: ['MainBar', 'NodeTree', 'LeafList', 'StatusBar'],

    paths: {
        'Webed': '../static/app'
    },

    launch: function () {
        Ext.create ('Webed.view.Viewport');
    }
});
