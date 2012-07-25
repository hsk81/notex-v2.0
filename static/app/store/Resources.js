Ext.define('Webed.store.Resources', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Resource',
    model: 'Webed.model.Resource',

    autoLoad: true
});