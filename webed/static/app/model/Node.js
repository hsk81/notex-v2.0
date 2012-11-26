Ext.define ('Webed.model.Node', {
    extend: 'Ext.data.Model',
    fields: ['root_uuid', 'uuid', 'name', 'size', 'mime'],

    proxy: {
        type: 'rest',
        url: '/node',
        reader: {
            type: 'json', root: 'results'
        }
    }
});
