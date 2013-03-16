Ext.define('Webed.store.Properties', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Property',
    model: 'Webed.model.Property',

    listeners: {
        beforeload: function (store) {

            //
            // Stop loading if locked: Simple method to control loading; it
            // allows load *only* if `loadLock` is empty!
            //

            return store.loadLock.empty ();
        }
    },

    autoLoad: false,
    loadLock: create_lock ([]) //no lock!
});
