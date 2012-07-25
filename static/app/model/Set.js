Ext.define ('Webed.model.Set', {
    extend: 'Ext.data.Model',
    fields: ['id', 'uuid', 'name', 'size'],

    proxy: {
        type: 'rest',
        url: '/sets/'
    }
});