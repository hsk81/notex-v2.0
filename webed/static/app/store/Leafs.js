Ext.define ('Webed.store.Leafs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Leaf',
    model: 'Webed.model.Leaf',

    listeners: {
        prefetch: function (store, records, successful, eOpts) {
            if (records && successful) {
                records.forEach (function (record) {
                    this.decorate (record);
                }, this);
            }
        }
    },

    decorate: function (leaf) {
        var mime = leaf.get ('mime');
        assert (mime);
        var icon = MIME.to_icon (mime, '-16');
        assert (icon);

        leaf.set ('iconCls', icon);
    },

    sorters: [{
        property: 'name_path'
    }],

    leadingBufferZone: 1000,
    remoteFilter: false,
    remoteSort: true,
    buffered: true,
    autoLoad: true,
    pageSize: 100
});
