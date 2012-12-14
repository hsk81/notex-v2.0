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
            set_properties: this.set_properties, scope: this
        });

        this.application.on ({
            get_property: this.get_property, scope: this
        });

        this.application.on ({
            get_properties: this.get_properties, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    set_property: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.property);
        assert (args.property.node_uuid);
        assert (args.property.uuid||true);
        assert (args.property.type);
        assert (args.property.mime);
        assert (args.property.name);
        assert (args.property.data||true);

        var model = Ext.create ('Webed.model.Property', args.property);
        assert (model);

        var model = model.save ({
            scope: args.scope||this, callback: function (prop, op) {
                if (args.callback && args.callback.call) {
                    args.callback.call (args.scope||this, prop, op);
                }
            }
        });

        assert (model);
    },

    set_properties: function (source, args) {

        assert (args);
        assert (args.properties && args.properties.length >= 0);
        assert (args.callback);
        assert (args.scope||this);

        var properties = [], ops = [];
        for (var index in args.properties) {
            this.set_property (source, {
                scope: args.scope||this, callback: function (prop, op) {
                    properties.push (prop); ops.push (op);
                    if (properties.length == args.properties.length) {
                        args.callback.call (args.scope||this, properties, ops);
                    }
                }, property: args.properties[index]
            });
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_property: function (source, args) {
        if (source == this) return;

        assert (args);
        assert (args.property);
        assert (args.callback);
        assert (args.scope||this);

        this.get_properties (source, {
            scope: args.scope||this, callback: function (recs, op) {
                if (recs && recs.length > 0) {
                    assert (recs.length == 1);
                    args.callback.call (args.scope||this, recs[0], op);
                } else {
                    args.callback.call (args.scope||this, null, op);
                }
            }, property: args.property
        });
    },

    get_properties: function (source, args) {

        assert (args);
        assert (args.property);
        assert (args.callback);
        assert (args.scope||this);

        var store = this.getPropertiesStore ();
        assert (store);

        var index = store.findBy (function (rec, id) {
            return and (args.property, function (key, value) {
                return rec.get (key) == value
            });
        });

        if (index >= 0) {
            args.callback.call (args.scope||this, [store.getAt (index)], {
                success: true
            });
        } else {
            store.load ({
                params: args.property,
                callback: args.callback,
                scope: args.scope||this
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
