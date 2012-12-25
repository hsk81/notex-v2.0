Ext.define ('Webed.model.Leaf', {
    extend: 'Ext.data.Model',
    fields: ['name_path', 'path', 'root_uuid', 'uuid', 'name', 'mime', 'size'],

    proxy: {
        type: 'rest',
        url: '/leaf',
        reader: {
            type: 'json', root: 'results', totalProperty: 'total'
        }
    }
});
