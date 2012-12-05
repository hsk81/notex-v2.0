Ext.define ('Webed.model.Property', {
    extend: 'Ext.data.Model',
    fields: ['node_uuid', 'uuid', 'type', 'mime', 'name', 'data'],

    proxy: {
        type: 'ajax',
        url: '/static/data/properties.json',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
