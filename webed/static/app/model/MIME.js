Ext.define('Webed.model.MIME', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'mime', type: 'string'
    },{
        name: 'name', type: 'string'
    },{
        name: 'ext', type: 'string'
    },{
        name: 'icon', type: 'string'
    },{
        name: 'main', defaultValue: null
    },{
        name: 'flag', defaultValue: null
    },{
        name: 'hidden', type: 'boolean', defaultValue: false
    }]
});
