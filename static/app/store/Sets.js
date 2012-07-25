Ext.define ('Webed.store.Sets', {
    extend: 'Ext.data.TreeStore',
    requires: 'Webed.model.Set',
    model: 'Webed.model.Set',

    root: {
        expanded: false,
        id: 0,
        name: 'Root',
        size: 0,
        uuid: '00000000-0000-0000-0000-000000000000'
    }
});
