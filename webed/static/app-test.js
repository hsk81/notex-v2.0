Ext.Loader.setConfig ({enabled: true});
Ext.Loader.setPath ({
    'Ext': '../static/lib/extjs/src', 'Webed': '../static/app'
});

Ext.require ('Ext.app.Application');
Ext.require ('Ext.data.writer.Json');
Ext.require ('Ext.data.reader.Json');
Ext.require ('Ext.grid.column.Number');

Ext.require ('Webed.store.Nodes');
Ext.require ('Webed.store.Leafs');
Ext.require ('Webed.store.Resources');

Ext.onReady (function() {
    window.app = Ext.create ('Ext.app.Application', {
        name: 'Webed',

        models: ['Node', 'Leaf', 'Resource'],
        stores: ['Nodes', 'Leafs', 'Resources'],
        controllers: ['MainBar', 'NodeTree', 'LeafList', 'StatusBar'],

        paths: {
            'Webed': '../static/app'
        },

        launch: function () {
            var env = jasmine.getEnv ();
            env.updateInterval = 250;

            var reporter = new jasmine.HtmlReporter ();
            assert (reporter);

            env.specFilter = function (spec) {
                return reporter.specFilter (spec);
            };

            env.addReporter (reporter);
            env.execute ();
        }
    });
});
