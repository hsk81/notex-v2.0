Ext.define ('Webed.controller.ContentTabs', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'content-tabs', ref: 'contentTabs'
    }],

    requires: [
        'Webed.view.EditorTBar.txt',
        'Webed.view.EditorTBar.rst'
    ],

    stores: ['MIMEs'],

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
        });

        this.application.on ({
            delete_tab: this.delete_tab, scope: this
        })
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    render: function (view) {
        assert (Ext.fly ('content-wrap')).destroy ();
    },

    beforeadd: function (view, component, index) {
        if (view.items.length == 0) {
            assert (Ext.fly ('page-wrap')).setDisplayed (false);
        }
    },

    remove: function (view, component) {
        if (view.items.length == 0) {
            assert (Ext.fly ('page-wrap')).setDisplayed (true);
        }
    },

    tabchange: function (tabPanel, newCard, oldCard) {
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
        var record = assert (args.record);
        var mime = assert (record.get ('mime'));

        if (MIME.is_text (mime))
            this.create_text_tab (record, args.callback, args.scope);
        else if (MIME.is_image (mime))
            this.create_image_tab (record, args.callback, args.scope);
    },

    create_text_tab: function (record, callback, scope) {
        assert (record);

        var uuid = assert (record.get ('uuid'));
        var mime = assert (record.get ('mime'));
        var name = assert (record.get ('name'));
        var iconCls = assert (record.get ('iconCls'));
        var view = assert (this.getContentTabs ());
        var app = assert (this.application);

        var tab = this.get_tab (uuid);
        if (tab == undefined) {
            tab = view.add ({
                record: record,
                title: name,
                closable: true,
                iconCls: iconCls,
                layout: 'fit',

                tbar: {
                    xtype: function (store) {
                        var record = assert (store.findRecord ('mime', mime));
                        var flag = assert (record.get ('flag'));
                        var tbar = flag['tbar'];

                        return tbar ? tbar : 'editor-tbar-txt';
                    } (assert (this.getMIMEsStore ()))
                },

                items: [Ext.create ('Webed.form.field.CodeArea', {
                    mime: mime, listeners: {
                        render: function (ca) {
                            ca.setLoading ('Loading ..');

                            app.fireEvent ('get_property', this, {
                                callback: on_get, scope: this, property: [{
                                    node_uuid: uuid, name: 'data'
                                }]
                            });

                            function on_get (props) {
                                assert (props && props.length > 0);
                                var data = props[0].get ('data');
                                assert (data || data == '');
                                ca.setValue (data);

                                if (callback && callback.call) {
                                    callback.call (scope||this, props);
                                }

                                ca.setLoading (false);
                            }
                        }
                    }
                })],

                listeners: {
                    afterlayout: function (panel) {
                        var height = panel.getHeight ();
                        assert (typeof (height) == 'number');
                        var ca = panel.child ('code-area');
                        assert (ca); ca.setHeight (height-2);
                    },

                    activate: function (panel) {
                        assert (panel.child ('code-area')).focus (true, 125);
                    }
                }
            });
        }

        view.setActiveTab (tab);
    },

    create_image_tab: function (record, callback, scope) {
        assert (record);

        var uuid = assert (record.get ('uuid'));
        var name = assert (record.get ('name'));
        var iconCls = assert (record.get ('iconCls'));
        var view = assert (this.getContentTabs ());
        var app = assert (this.application);

        var tab = this.get_tab (uuid) || view.add ({
            autoScroll: true,
            bodyStyle: 'background: grey;',
            closable: true,
            iconCls: iconCls,
            layout: 'absolute',
            record: record,
            title: name,

            listeners: {
                render: function (panel) {
                    panel.setLoading ('Loading ..');

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
                            },
                            listeners: {
                                render: function () { center (panel, 1); }
                            }
                        });

                        if (callback && callback.call) {
                            callback.call (scope||this, props);
                        }

                        panel.setLoading (false);
                    }
                }
            }
        });

        function center (panel, ms, stop) {
            if (ms && ms > 0) {
                Ext.defer (function () { center (panel, 0, stop); }, ms);
            } else {
                var inner = panel.down ('box');
                if (inner || stop>=1) {
                    var outer = panel.body;
                    if (outer || stop>=2) {
                        var W = outer.getWidth ();
                        var H = outer.getHeight ();
                        var w = inner.getWidth ();
                        var h = inner.getHeight ();

                        if (w>0 && h>0 || stop>=3) {
                            var innerDx = (W - w) / 2.0;
                            var innerDy = (H - h) / 2.0;

                            inner.setPosition (innerDx, innerDy);
                        } else {
                            center (panel, 10, 3);
                        }
                    } else {
                        center (panel, 10, 2);
                    }
                } else {
                    center (panel, 10, 1);
                }
            }
        }

        view.setActiveTab (tab);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_tab: function (source, args) {
        if (source == this) return;
        assert (args && args.record);

        var mime = assert (args.record.get ('mime'));
        var uuid = assert (args.record.get ('uuid'));
        var tab = this.get_tab (uuid);
        if (!tab) return;

        if (MIME.is_text (mime))
            this.update_text_tab (tab, args.callback, args.scope);
        else if (MIME.is_image (mime))
            this.update_image_tab (tab, args.callback, args.scope);
    },

    update_text_tab: function (tab, callback, scope) {
        assert (tab);

        var record = assert (tab.record);
        var uuid = assert (record.get ('uuid'));
        var ta = assert (tab.child ('code-area'));
        var data = ta.getValue (); assert (data != null);

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

        var uuid = assert (args.record.get ('uuid'));
        var name = assert (args.record.get ('name'));
        var tab = this.get_tab (uuid);
        if (tab) tab.setTitle (name);
    },

    delete_tab: function (source, args) {
        if (source == this) return;
        assert (args && args.record);

        var uuid = assert (args.record.get ('uuid'));
        var tab = this.get_tab (uuid);
        if (tab) tab.close ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_tab: function (uuid) {
        assert (uuid);

        var view = assert (this.getContentTabs ());
        var tabs = assert (view.queryBy (function (el) {
            return (el.record && el.record.get ('uuid') == uuid)
                ? true : false;
        }, this));

        return (tabs.length > 0) ? tabs[0] : null;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
