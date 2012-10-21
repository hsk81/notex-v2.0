Ext.define ('Webed.model.Doc', {
    extend: 'Ext.data.Model',
    fields: ['root-uuid', 'uuid', 'name', 'ext', 'size'],

    proxy: {
        type: 'rest',
        url: '/docs',
        reader: {
            type: 'json', root: 'results'
        }
    }
});
