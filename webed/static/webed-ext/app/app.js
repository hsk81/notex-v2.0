Ext.Loader.setConfig ({
    enabled: true
});

Ext.Loader.setPath ({
    'Ext': '../static/ext/src',
    'Ext.ux': '../static/ext/src/ux',
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
    'Webed.store.Properties'
]);

Ext.application ({
    name: 'Webed',
    models: ['MIME', 'Lingua', 'Node', 'Leaf', 'Property'],
    stores: ['MIMEs', 'Linguas', 'Nodes', 'Leafs', 'Properties'],

    requires: [
        'Webed.container.Viewport'
    ],

    controllers: [
        'Leaf',
        'Node',
        'Property',

        'grid.LeafList',
        'panel.ImageViewer',
        'panel.RestTextEditor',
        'panel.TextEditor',
        'statusbar.StatusBar',
        'tab.TabManager',
        'toolbar.MainToolbar',
        'toolbar.ExportAsToolbar',
        'toolbar.MarkdownToolbar',
        'toolbar.RestToolbar',
        'toolbar.TextToolbar',
        'tree.NodeTree',
        'window.AddFileBox',
        'window.AddFolderBox',
        'window.AddProjectBox',
        'window.AddRestProjectBox',
        'window.AnnotateBox',
        'window.ArchiveUploadBox',
        'window.ConfirmBox',
        'window.DeleteBox',
        'window.FileUploadBox',
        'window.InsertLinkBox',
        'window.InsertPictureBox',
        'window.RenameBox'
    ],

    paths: {
        'Webed': '../static/webed-ext/app'
    },

    appProperty: 'app',

    launch: function () {
        Webed[this.appProperty] = this;
        this.viewport = Ext.create ('Webed.container.Viewport');
    },

    global: {
        get: function (key, opts) {
            var value = this._cache[key];
            if (opts && opts.clear) this._cache[key] = undefined;
            return value;
        },
        set: function (key, value) {
            this._cache[key] = value;
        },
        _cache: {}
    },

    get_selection: function () {
        return assert (this.getController ('tree.NodeTree')).get_selection ();
    }
});
