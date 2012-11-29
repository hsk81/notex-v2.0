Ext.Loader.setConfig ({enabled: true});
Ext.Loader.setPath ({'Ext': '../static/lib/extjs/src'});

Ext.require ('Ext.app.Application'); var App = null; Ext.onReady (function() {
    App = Ext.create ('Ext.app.Application', {
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
                return reporter.specFilter(spec);
            };

            env.addReporter (reporter);
            env.execute ();
        }
    });
});
