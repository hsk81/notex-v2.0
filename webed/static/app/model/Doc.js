Ext.define ('Webed.model.Doc', {
    extend: 'Ext.data.Model',
    fields: ['root_uuid', 'uuid', 'name', 'size', 'mime'],

    proxy: {
        type: 'rest',
        url: '/leaf',
        reader: {
            type: 'json', root: 'results'
        }
    }
});
