Ext.define ('Webed.store.MIMEs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.MIME',
    model: 'Webed.model.MIME',

    listeners: {
        load: function (store, records, successful) {

            if (successful) {
                var nodes = assert (Ext.getStore ('Nodes'));
                nodes.autoLoad = true;
                nodes.load ();
            } else {
                console.error ('[MIMEs::load]', 'failed')
            }
        }
    },

    autoLoad: true
});
