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
        name: 'main', defaultValue: null
    },{
        name: 'flag', defaultValue: {
            text: undefined,
            image: undefined,
            hidden: undefined
        }
    }]
});
