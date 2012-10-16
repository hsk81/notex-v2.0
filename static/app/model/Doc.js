Ext.define ('Webed.model.Doc', {
    extend: 'Ext.data.Model',
    fields: ['uuid', 'name', 'ext', 'size', 'rsrc'],

    proxy: {
        type: 'rest',
        url: '/docs',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
