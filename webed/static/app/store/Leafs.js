Ext.define ('Webed.store.Leafs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Leaf',
    model: 'Webed.model.Leaf',

    listeners: {
        prefetch: function (store, records, successful) {
            if (records && successful) records.forEach (function (record) {
                this.decorate (record);
            }, this);
        },

        beforeload: function (store, operation) {

            //
            // Stop loading if locked: Simple method to control loading; it
            // allows load *only* if `loadLock` is empty!
            //

            return store.loadLock.empty ();
        }
    },

    decorate: function (leaf) {
        var mime = assert (leaf.get ('mime'));
        var icon = assert (MIME.to_icon (mime, '-16'));
        leaf.set ('iconCls', icon);
    },

    sorters: [{
        property: 'name_path'
    }],

    leadingBufferZone: 750,
    remoteFilter: true,
    remoteSort: true,
    autoLoad: false,
    loadLock: create_lock ([true]),
    buffered: true,
    pageSize: 250
});
