Ext.define('Webed.store.Properties', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Property',
    model: 'Webed.model.Property',

    clearOnLoad: false,
    autoLoad: false
});
