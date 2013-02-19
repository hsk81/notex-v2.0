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
                remove: this.remove,
                tabchange: this.tabchange
            }
        });

        this.application.on ({
            create_tab: this.create_tab, scope: this
        });

        this.application.on ({
            update_tab: this.update_tab, scope: this
        });

        this.application.on ({
            rename_tab: this.rename_tab, scope: this
        })

        this.application.on ({
            delete_tab: this.delete_tab, scope: this
        })
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

    tabchange: function (tabPanel, newCard, oldCard, eOpts) {
        this.application.fireEvent ('select_node', this, {
            record: newCard.record
        });

        this.application.fireEvent ('select_leaf', this, {
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
        var app = this.application;
        assert (app);

        var tab = this.get_tab (uuid);
        if (tab == undefined) {
            tab = view.add ({
                record: record,
                title: name,
                closable: true,
                iconCls: iconCls,
                layout: 'fit',

                items: [{
                    xtype: 'code-area',
                    listeners: {
                        render: function (ta) {
                            ta.setLoading ('Loading ..');

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

                                ta.setLoading (false);
                            }
                        }
                    }
                }],

                listeners: {
                    afterlayout: function (panel) {
                        var height = panel.getHeight ();
                        assert (typeof (height) == 'number');

                        var rule = '.CodeMirror';
                        var property = 'height';
                        var value = height - 2 + 'px';

                        var result = Ext.util.CSS.updateRule (
                            rule, property, value
                        );

                        assert (result);
                        var ca = panel.child ('code-area');
                        assert (ca); ca.updateLayout ();
                    }
                }
            });
        }

        view.setActiveTab (tab);
    },

    create_image_tab: function (record, callback, scope) {
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

        var tab = this.get_tab (uuid) || view.add ({
            autoScroll: true,
            bodyStyle: 'background: grey;',
            closable: true,
            iconCls: iconCls,
            layout: 'absolute',
            record: record,
            title: name,

            listeners: {
                afterrender: function (panel) {
                    app.fireEvent ('get_property', this, {
                        callback: on_get, scope: this, property: [{
                            node_uuid: uuid, name: 'data'
                        }]
                    });

                    function on_get (props) {
                        assert (props && props.length > 0);
                        var data = props[0].get ('data');
                        assert (data || data == '');

                        panel.add ({
                            xtype: 'box', autoEl: {
                                tag: 'img', src: data
                            }
                        });

                        if (callback && callback.call) {
                            callback.call (scope||this, props);
                        }

                        setTimeout (function() { panel.el.unmask (); }, 75);
                    }
                },

                afterlayout: function (panel) {
                    if (!panel.down ('box')) setTimeout (function() {
                        panel.el.mask ('Loading...');
                    }, 25);

                    setTimeout (function() { center (panel); }, 10);
                }
            }
        });

        function center (panel, stop) {
            var inner = panel.down ('box');
            if (inner) {
                var outer = panel.body;
                if (outer) {
                    var W = outer.getWidth ();
                    var H = outer.getHeight ();
                    var w = inner.getWidth ();
                    var h = inner.getHeight ();

                    if (w>0 && h>0 || stop) {
                        var innerDx = (W - w) / 2.0;
                        var innerDy = (H - h) / 2.0;

                        inner.setPosition (innerDx, innerDy);
                    } else {
                        setTimeout (function () { center (panel, true); }, 10);
                    }
                } else {
                    setTimeout (function () { center (panel); }, 10);
                }
            } else {
                setTimeout (function () { center (panel); }, 10);
            }
        }

        view.setActiveTab (tab);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_tab: function (source, args) {
        if (source == this) return;
        assert (args && args.record);

        var uuid = args.record.get ('uuid');
        assert (uuid);
        var mime = args.record.get ('mime');
        assert (mime);

        var tab = this.get_tab (uuid);
        if (!tab) return;

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

        var ta = tab.child ('code-area');
        assert (ta);
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
                    if (callback && callback.call) {
                        callback.call (scope||this, [prop], op);
                    }
                }
            });
        }
    },

    update_image_tab: function (tab, callback, scope) {
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    rename_tab: function (source, args) {
        if (source == this) return;
        assert (args && args.record);

        var uuid = args.record.get ('uuid');
        assert (uuid);
        var name = args.record.get ('name');
        assert (name);

        var tab = this.get_tab (uuid);
        if (tab) tab.setTitle (name);
    },

    delete_tab: function (source, args) {
        if (source == this) return;
        assert (args && args.record);

        var uuid = args.record.get ('uuid');
        assert (uuid);

        var tab = this.get_tab (uuid);
        if (tab) tab.close ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_tab: function (uuid) {
        assert (uuid);

        var view = this.getContentTabs ();
        assert (view);

        var tabs = view.queryBy (function (el) {
            return (el.record && el.record.get ('uuid') == uuid)
                ? true : false;
        }, this);

        assert (tabs);
        return (tabs.length > 0) ? tabs[0] : null;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
