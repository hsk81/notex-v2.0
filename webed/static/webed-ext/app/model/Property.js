Ext.define ('Webed.model.Property', {
    extend: 'Ext.data.Model',
    fields: [
        'node_uuid', 'uuid', 'type', 'mime', 'name', 'size', 'data', 'meta'
    ],

    proxy: {
        type: 'rest',
        url: '/property',
        reader: {
            type: 'json', root: 'results'
        }
    }
});
