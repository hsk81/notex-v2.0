Ext.define('Webed.model.Lingua', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'lingua', type: 'string'
    },{
        name: 'charset', type: 'string'
    },{
        name: 'country', type: 'string', defaultValue: 'INTL'
    },{
        name: 'direction', type: 'string', defaultValue: 'ltr'
    },{
        name: 'hidden', type: 'boolean', defaultValue: false
    },{
        name: 'name', type: 'string'
    },{
        name: 'flag', type: 'string', defaultValue: 'icon-flag_united_nations'
    },{
        name: 'full', type: 'string', convert: function (v, record) {
            return record.data.name + ': ' + record.data.country;
        }
    }]
});
