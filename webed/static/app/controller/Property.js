Ext.define ('Webed.controller.Property', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Property'],
    stores: ['Properties'],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.application.on ({
            set_property: this.set_property, scope: this
        });

        this.application.on ({
            get_property: this.get_property, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    set_property: function (source, args) {
        if (source == this) return;

        var store = this.getPropertiesStore ();
        assert (store);

        assert (args);
        assert (args.property);
        assert (args.property.length >= 0);

        Ext.Array.each (args.property, function (prop, index) {

            assert (prop);
            assert (prop.node_uuid);
            assert (prop.uuid||true);
            assert (prop.type);
            assert (prop.mime);
            assert (prop.name);
            assert (prop.data||true);
            assert (prop.size||true);

            if (!prop.uuid) prop.uuid = UUID.random ();
            if (!prop.data) prop.data = '';
            if (!prop.size) prop.size = 0;

            var model = Ext.create ('Webed.model.Property', prop);
            assert (model);

            var model = model.save ({
                scope: this, callback: function (rec, op) {

                    if (rec) {
                        var models = store.add (rec);
                        assert (models && models.length > 0);
                    }

                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, rec, op, index);
                    }
                }
            });

            assert (model);
        });
    },

    get_property: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.property);
        assert (args.property.length >= 0);
        assert (args.callback);
        assert (args.callback.call);

        var store = this.getPropertiesStore ();
        assert (store);

        var array = Ext.Array.map (args.property, function () {
            return [];
        });

        store.queryBy (function (prop) {
            Ext.Array.each (args.property, function (object, index) {
                Ext.Object.each (object, function (key, value) {
                    if (prop.get (key) != value) { index = -1; return false; }
                });

                if (index >= 0) array[index].push (prop);
            });
        });

        Ext.Array.each (array, function (recs, index) {
            if (recs.length > 0) {
                args.callback.call (args.scope||this, recs, index);
            } else {
                store.load ({
                    scope: args.scope||this, callback: function (recs) {
                        args.callback.call (args.scope||this, recs, index);
                    }, params: args.property[index], addRecords: true
                });
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
