Ext.define ('Webed.model.Set', {
    extend: 'Ext.data.Model',
    fields: ['root_uuid', 'uuid', 'name', 'size'],

    /**
     * See http://docs.sencha.com/ext-js/4-1/#!/api/Ext.data.proxy.Rest-method-buildUrl
     * to append "uuid" parameter!
     */

    proxy: {
        type: 'rest',
        url: '/node',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
