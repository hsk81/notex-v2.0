Ext.define ('Webed.model.Leaf', {
    extend: 'Ext.data.Model',
    fields: ['path', 'root_uuid', 'uuid', 'name', 'size', 'mime'],

    proxy: {
        type: 'rest',
        url: '/leaf',
        reader: {
            type: 'json', root: 'results'
        }
    }
});
