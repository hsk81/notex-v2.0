Ext.define ('Webed.model.Doc', {
    extend: 'Ext.data.Model',
    fields: ['root-uuid', 'uuid', 'name', 'ext', 'size'],

    /**
     * See http://docs.sencha.com/ext-js/4-1/#!/api/Ext.data.proxy.Rest-method-buildUrl
     * to append "uuid" parameter!
     */

    proxy: {
        type: 'rest',
        url: '/docs',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
