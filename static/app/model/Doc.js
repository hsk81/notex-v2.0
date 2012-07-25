Ext.define ('Webed.model.Doc', {
    extend: 'Ext.data.Model',
    fields: ['uuid', 'name', 'ext', 'size', 'rsrc'],

    proxy: {
        type: 'ajax',
        url: 'static/data/docs.json',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});