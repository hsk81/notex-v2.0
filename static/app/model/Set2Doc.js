Ext.define ('Webed.model.Set2Doc', {
    extend: 'Ext.data.Model',
    fields: ['set', 'doc'],

    proxy: {
        type: 'ajax',
        url: 'static/data/set2docs.json',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});