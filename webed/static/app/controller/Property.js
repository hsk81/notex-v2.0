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

        Ext.Array.each (args.property, function (prop, index) {

            assert (prop);
            assert (prop.node_uuid);
            assert (prop.uuid||true);
            assert (prop.type);
            assert (prop.mime);
            assert (prop.name);
            assert (prop.data||true);
            assert (prop.size==null);

            //
            // TODO: Maybe it is a good idea to extend the meaning of `set-
            //       property` from "create" to "create-or-update" property!?
            //

            var model = Ext.create ('Webed.model.Property', prop);
            assert (model);

            if (!prop.uuid) {
                prop.uuid = UUID.random (); // TODO: Remove with next todo!
            }

            var model = model.save ({
                scope: this, callback: function (rec, op) {
                    assert (rec && op);

                    var uuid = rec.get ('uuid');
                    assert (uuid);
                    var size = rec.get ('size');
                    assert (size == ''); // TODO: Remove with next todo!

                    if (op.success) {

                        //
                        // TODO: Since ExtJS has the stupid courtesy *not* to
                        //       set all data on save (the server annotations
                        //       are completely ignored) we're force to do a
                        //       second request to ask for rest; fix!
                        //

                        Webed.model.Property.load (null, {
                            scope: this, callback: function (rec, op) {
                                assert (rec && op);

                                if (args.callback && args.callback.call) {
                                    args.callback.call (
                                        args.scope||this, rec, op, index);
                                }
                            }, params: {uuid: uuid}
                        });
                    } else {
                        if (args.callback && args.callback.call) {
                            args.callback.call (
                                args.scope||this, rec, op, index);
                        }
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
