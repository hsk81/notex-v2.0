Ext.define ('Webed.model.Set', {
    extend: 'Ext.data.Model',
    fields: ['uuid', 'name', 'size'],

    proxy: {
        type: 'rest',
        url: '/sets',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
