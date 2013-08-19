Ext.Loader.setConfig ({
    enabled: true
});

Ext.Loader.setPath ({
    'Ext': '../static/lib/extjs/src',
    'Webed': '../static/webed-ext/app'
});

Ext.require ([
    'Ext.form.field.VTypes',
    'Ext.data.writer.Json',
    'Ext.data.reader.Json',
    'Ext.data.proxy.Rest',

    'Webed.store.MIMEs',
    'Webed.store.Linguas',
    'Webed.store.Nodes',
    'Webed.store.Leafs',
    'Webed.store.Properties',

    'Ext.app.Application'
]);

Ext.onReady (function() {
    window.app = Ext.create ('Ext.app.Application', {
        name: 'Webed',

        models: ['MIME', 'Lingua', 'Node', 'Leaf', 'Property'],
        stores: ['MIMEs', 'Linguas', 'Nodes', 'Leafs', 'Properties'],

        paths: {
            'Webed': '../static/webed-ext/app'
        },

        launch: function () {
            var env = assert (jasmine.getEnv ());
            env.defaultTimeoutInterval = 4096; //ms
            var reporter = new jasmine.HtmlReporter ();

            env.specFilter = function (spec) {
                return reporter.specFilter (spec);
            };

            env.addReporter (reporter);
            env.execute ();
        }
    });
});
