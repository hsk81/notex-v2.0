Ext.define ('Webed.store.Leafs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Leaf',
    model: 'Webed.model.Leaf',

    listeners: {
        load: function (store, records, successful, eOpts) {
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

    autoLoad: false
});
