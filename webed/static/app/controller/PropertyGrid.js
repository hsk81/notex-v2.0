Ext.define ('Webed.controller.PropertyGrid', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Property'],
    stores: ['Properties'],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.application.on ({
            read_property: this.read_property, scope: this
        });

        this.application.on ({
            update_property: this.update_property, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    read_property: function (source, args) {
        if (source == this) return;

        assert (args);
        var property = args.property;
        assert (property);
        var do_read = args.do_read;
        assert (do_read);
        var on_load = args.on_load;
        assert (on_load);

        var store = this.getPropertiesStore ();
        assert (store);

        var index = store.findBy (function (rec, id) {
            return and (property, function (key, value) {
                return rec.get (key) == value
            });
        });

        if (index >= 0) {
            do_read (store.getAt (index));
        } else {
            store.load ({
                params: property, callback: on_load, scope: this
            });
        }
    },

    update_property: function (source, args) {
        if (source == this) return;

        assert (args);
        var property = args.property;
        assert (property);
        var do_save = args.do_save;
        assert (do_save);
        var on_load = args.on_load;
        assert (on_load);

        var store = this.getPropertiesStore ();
        assert (store);

        var index = store.findBy (function (rec, id) {
            return and (property, function (key, value) {
                return rec.get (key) == value
            });
        });

        if (index >= 0) {
            do_save (store.getAt (index));
        } else {
            store.load ({
                params: property, callback: on_load, scope: this
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
