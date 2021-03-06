Ext.define('Webed.model.MIME', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'mime', type: 'string'
    },{
        name: 'name', type: 'string'
    },{
        name: 'exts', defaultValue: []
    },{
        name: 'icon', type: 'string'
    },{
        name: 'main', type: 'string', defaultValue: null
    },{
        name: 'flag', defaultValue: {}
    }],

    proxy: {
        type: 'rest', url: '/mime-info', reader: {
            type: 'json', root: 'results'
        }
    }
});
