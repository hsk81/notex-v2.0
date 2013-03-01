Ext.define('Webed.model.Lingua', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'lingua',  type: 'string'
    },{
        name: 'charset', type: 'string'
    },{
        name: 'name', type: 'string'
    },{
        name: 'country', type: 'string'
    },{
        name: 'full', type: 'string', convert: function (v, record) {
            return record.data.name + ': ' + record.data.country;
        }
    }]
});
