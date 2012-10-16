Ext.Loader.setPath ({
    'Ext': '../static/lib/extjs/src'
});

Ext.application ({
    name: 'Webed',
    requires: ['Ext.container.Viewport'],

    models: ['Set', 'Doc', 'Set2Doc', 'Resource'],
    stores: ['Sets', 'Docs', 'Set2Docs', 'Resources'],

    controllers: ['MainBar', 'SetTree', 'DocList', 'StatusBar'],

    paths: {
        'Webed': '../static/app'
    },

    launch: function () {
        Ext.create ('Webed.view.Viewport');
    }
});
