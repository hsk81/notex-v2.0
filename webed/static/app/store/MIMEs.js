Ext.define ('Webed.store.MIMEs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.MIME',
    model: 'Webed.model.MIME',

    listeners: {
        load: function (store, records, successful) {

            if (successful) {
                var nodes = assert (Ext.getStore ('Nodes'));
                if (nodes.loadLock.pop (true) && nodes.autoLoad) nodes.load ();
                var leafs = assert (Ext.getStore ('Leafs'));
                if (leafs.loadLock.pop (true) && leafs.autoLoad) leafs.load ();
            } else {
                console.error ('[MIMEs::load]', 'failed')
            }
        }
    },

    autoLoad: true
});
