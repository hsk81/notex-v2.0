Ext.define ('Webed.controller.ContentTabs', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    models: ['Property'],
    stores: ['Properties'],

    refs: [{
        selector: 'content-tabs', ref: 'contentTabs'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'content-tabs' : {
                render: this.render,
                tabchange: this.tabchange,
                beforeadd: this.beforeadd,
                remove: this.remove
            }
        });

        this.application.on ({
            nodeselect: this.create_tab, scope: this
        });

        this.application.on ({
            update_tab: this.update_tab, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    render: function (view, eOpts) {
        var wrap = Ext.fly ('content-wrap');
        assert (wrap); wrap.destroy ();
    },

    beforeadd: function (view, component, index) {
        if (view.items.length == 0) {
            var wrap = Ext.fly ('page-wrap');
            assert (wrap); wrap.setDisplayed (false);
        }
    },

    remove: function (view, component) {
        if (view.items.length == 0) {
            var wrap = Ext.fly ('page-wrap');
            assert (wrap); wrap.setDisplayed (true);
        }
    },

    tabchange: function (view, newCard, oldCard, eOpts) {
        assert (newCard);
        assert (newCard.record);

        this.application.fireEvent ('nodeselect', this, {
            record: newCard.record
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    create_tab: function (source, args) {
        if (source == this) return;

        assert (args);
        var record = args.record;
        assert (record);
        var mime = record.get ('mime');
        assert (mime);

        if (MIME.is_text (mime))
            this.create_text_tab (record, args.callback, args.scope);
        else if (MIME.is_image (mime))
            this.create_image_tab (record, args.callback, args.scope);
    },

    create_text_tab: function (record, callback, scope) {
        assert (record);

        var uuid = record.get ('uuid');
        assert (uuid);
        var name = record.get ('name');
        assert (name);
        var iconCls = record.get ('iconCls');
        assert (iconCls);

        var view = this.getContentTabs ();
        assert (view);
        var store = this.getPropertiesStore ();
        assert (store);

        var tab = this.get_tab (uuid, view);
        var tab = tab ? tab : view.add ({
            record: record,
            title: name,
            closable: true,
            iconCls: iconCls,
            layout: 'fit',

            items: [{
                xtype: 'textarea',
                listeners: {
                    beforerender: function (ta, eOpts) {

                        //
                        // TODO: Try webthread, since for large data UI blocks;
                        //       but only if it keeps blocking with CodeMirror,
                        //       since it seems to be a TextArea issue.
                        //

                        //
                        // TODO: Check first if property is loaded (see save)!
                        //

                        store.load ({
                            params: { node_uuid: uuid, name: 'data' },
                            callback: function (records, op, success) {

                                if (success && records && records.length > 0) {
                                    var data = records[0].get ('data');
                                    assert (data || data == '');
                                    ta.setValue (data);
                                }

                                if (callback && callback.call)
                                    callback.call (scope||this, records, op);
                                ta.el.unmask ();
                            }, scope: this, synchronous: false
                        });
                    },

                    afterrender: function (ta, eOpts) {
                        if (!ta.getValue ()) {
                            setTimeout (function() {
                                ta.el.mask ('Loading...');
                            }, 25);
                        }
                    }
                }
            }]
        });

        assert (tab);
        view.setActiveTab (tab);
    },

    create_image_tab: function (record, callback, scope) {
        //TODO: Image viewer!
    },

    ///////////////////////////////////////////////////////////////////////////

    get_tab: function (uuid, view) {
        assert (uuid);
        assert (view);

        var tabs = view.queryBy (function (el) {
            return (el.record && el.record.get ('uuid') == uuid)
                ? true : false;
        }, this);

        assert (tabs);
        return (tabs.length > 0) ? tabs[0] : null;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_tab: function (source, args) {
        if (source == this) return;
        var args = $.extend ({}, args);

        var view = this.getContentTabs();
        assert (view);
        var tab = view.getActiveTab ();
        if (!tab) return;

        var record = tab.record;
        assert (record);
        var mime = record.get ('mime');
        assert (mime);

        if (MIME.is_text (mime))
            this.update_text_tab (tab, args.callback, args.scope);
        else if (MIME.is_image (mime))
            this.update_image_tab (tab, args.callback, args.scope);
    },

    update_text_tab: function (tab, callback, scope) {
        assert (tab);
        var record = tab.record;
        assert (record);
        var uuid = record.get ('uuid');
        assert (uuid);

        var store = this.getPropertiesStore ();
        assert (store);
        var index = store.findBy (function (rec, id) {
            return rec.get ('node_uuid') == uuid
                && rec.get ('name') == 'data';
        });

        var ta = tab.child ('textarea');
        assert (ta);
        ta.el.mask ('Saving...');
        var data = ta.getValue ();
        assert (data);

        function do_save (property) {
            assert (property);

            property.set ('data', data);
            property.save ({
                scope: this, callback: function (rec, op) {
                    if (callback && callback.call)
                        callback.call (scope||this, [rec], op);
                    ta.el.unmask ();
                }
            });
        }

        function on_load (records, op, success) {
            if (success && records && records.length > 0) {
                do_save (records[0]);
            } else {
                if (callback && callback.call)
                    callback.call (scope||this, records, op);
            }

            ta.el.unmask ();
        }

        if (index >= 0) {
            do_save (store.getAt (index));
        } else {
            store.load ({
                params: { node_uuid: uuid, name: 'data' },
                callback: on_load, scope: this
            });
        }
    },

    update_image_tab: function (tab, callback, scope) {
        // TODO!
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
