Ext.define ('Webed.model.Set', {
    extend: 'Ext.data.Model',
    fields: ['root_uuid', 'uuid', 'name', 'size'],

    proxy: {
        type: 'rest',
        url: '/sets',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
