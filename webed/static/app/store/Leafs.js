Ext.define ('Webed.store.Leafs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Leaf',
    model: 'Webed.model.Leaf',

    listeners: {
        load: function (store, records, successful, eOpts) {
            records.forEach (function (record) {

                var mime = record.get ('mime');
                assert (mime);
                var icon = MIME.to_icon (mime, '-16');
                assert (icon);

                record.set ('iconCls', icon);
            });
        }
    },

    autoLoad: true
});
