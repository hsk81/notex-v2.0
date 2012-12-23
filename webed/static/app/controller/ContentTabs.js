Ext.define ('Webed.controller.ContentTabs', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'content-tabs', ref: 'contentTabs'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'content-tabs' : {
                render: this.render,
                beforeadd: this.beforeadd,
                remove: this.remove
            }
        });

        this.application.on ({
            create_tab: this.create_tab, scope: this
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
        var app = this.application;
        assert (app);

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

                        app.fireEvent ('get_property', this, {
                            callback: on_get, scope: this, property: [{
                                node_uuid: uuid, name: 'data'
                            }]
                        });

                        function on_get (props) {
                            assert (props && props.length > 0);

                            var data = props[0].get ('data');
                            assert (data || data == '');
                            ta.setValue (data);

                            if (callback && callback.call) {
                                callback.call (scope||this, props);
                            }

                            setTimeout (function() {
                                if (ta.el) ta.el.unmask ();
                            }, 75);
                        }
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
        //TODO!
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

        var ta = tab.child ('textarea');
        assert (ta);
        ta.el.mask ('Saving...');
        var data = ta.getValue ();
        assert (data);

        this.application.fireEvent ('get_property', this, {
            callback: on_get, scope: this, property: [{
                node_uuid: uuid, name: 'data'
            }]
        });

        function on_get (props) {
            assert (props && props.length > 0);

            props[0].set ('data', data);
            props[0].set ('size', utf8Length (data.length));

            props[0].save ({
                scope: this, callback: function (prop, op) {
                    if (callback && callback.call)
                        callback.call (scope||this, [prop], op);
                    if (ta.el) ta.el.unmask ();
                }
            });
        }
    },

    update_image_tab: function (tab, callback, scope) {
        //TODO!
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
