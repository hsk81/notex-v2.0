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
                    args.callback.call (args.scope||this, [prop], op);
                }
            }
        });

        assert (model);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_property: function (source, args) {
        if (source == this) return;

        assert (args);
        var property = args.property;
        assert (property);
        var callback = args.callback;
        assert (callback);
        var scope = args.scope||this;
        assert (scope);

        this.get_properties (source, {
            property: property, scope: scope, callback: function (recs, op) {
                if (recs && recs.length > 0) {
                    assert (recs.length == 1);
                    callback.call (scope, recs[0], op);
                } else {
                    callback.call (scope, undefined, op);
                }
            }
        });
    },

    get_properties: function (source, args) {
        if (source == this) return;

        assert (args);
        var property = args.property;
        assert (property);
        var callback = args.callback;
        assert (callback);
        var scope = args.scope||this;
        assert (scope);

        var store = this.getPropertiesStore ();
        assert (store);

        var index = store.findBy (function (rec, id) {
            return and (property, function (key, value) {
                return rec.get (key) == value
            });
        });

        if (index >= 0) {
            callback.call (scope, [store.getAt (index)], {success: true});
        } else {
            store.load ({
                params: property, scope: scope, callback: callback
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
