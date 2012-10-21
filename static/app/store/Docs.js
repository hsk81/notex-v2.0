Ext.define ('Webed.store.Docs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Doc',
    model: 'Webed.model.Doc',

    autoLoad: true
});
