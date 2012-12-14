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

        assert (args);
        assert (args.property);
        assert (args.property.length >= 0);

        for (var index in args.property) {
            var property = args.property[index];

            assert (property);
            assert (property.node_uuid);
            assert (property.uuid||true);
            assert (property.type);
            assert (property.mime);
            assert (property.name);
            assert (property.data||true);

            var model = Ext.create ('Webed.model.Property', property);
            assert (model);

            var model = model.save ({
                scope: args.scope||this, callback: function (prop, op) {
                    if (args.callback && args.callback.call) {
                        args.callback.call (args.scope||this, prop, op, index);
                    }
                }
            });

            assert (model);
        }
    },

    get_property: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.property);
        assert (args.property.length >= 0);
        assert (args.callback);

        for (var index in args.property) {
            var property = args.property[index];
            assert (property);
            var store = this.getPropertiesStore ();
            assert (store);

            var records = store.queryBy (function (rec, id) {
                return and (property, function (key, value) {
                    return rec.get (key) == value
                });
            });

            if (records.getCount () > 0) {
                var recs = []; records.each (function (rec) {
                    recs.push (rec);
                });

                args.callback.call (args.scope||this, recs, {
                    success: true
                }, index);
            } else {
                store.load ({
                    scope: args.scope||this, callback: function (recs, op) {
                        args.callback.call (args.scope||this, recs, op, index);
                    }, params: property
                });
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
