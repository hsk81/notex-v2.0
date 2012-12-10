Ext.define ('Webed.model.Node', {
    extend: 'Ext.data.Model',
    fields: ['path', 'root_uuid', 'uuid', 'name', 'mime', 'size'],

    proxy: {
        type: 'rest',
        url: '/node',
        reader: {
            type: 'json', root: 'results'
        }
    }
});
