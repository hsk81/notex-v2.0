Ext.define ('Webed.model.Resource', {
    extend: 'Ext.data.Model',
    fields: ['uuid', 'mime', 'data'],

    proxy: {
        type: 'ajax',
        url: 'static/data/resources.json',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});