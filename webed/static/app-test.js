Ext.Loader.setConfig ({enabled: true});
Ext.Loader.setPath ({
    'Ext': '../static/lib/extjs/src', 'Webed': '../static/app'
});

Ext.require ('Ext.app.Application');
Ext.require ('Ext.form.field.VTypes');
Ext.require ('Ext.data.writer.Json');
Ext.require ('Ext.data.reader.Json');

Ext.require ('Webed.store.MIMEs');
Ext.require ('Webed.store.Linguas');
Ext.require ('Webed.store.Nodes');
Ext.require ('Webed.store.Leafs');
Ext.require ('Webed.store.Properties');

Ext.onReady (function() {
    window.app = Ext.create ('Ext.app.Application', {
        name: 'Webed',

        models: ['MIME', 'Lingua', 'Node', 'Leaf', 'Property'],
        stores: ['MIMEs', 'Linguas', 'Nodes', 'Leafs', 'Properties'],

        paths: {
            'Webed': '../static/app'
        },

        launch: function () {
            var env = jasmine.getEnv ();
            env.defaultTimeoutInterval = 2048; //ms
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
