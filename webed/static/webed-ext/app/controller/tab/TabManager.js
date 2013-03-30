Ext.define ('Webed.controller.tab.TabManager', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'viewport', ref: 'viewport'
    },{
        selector: 'tab-manager', ref: 'tabManager'
    }],

    requires: [
        'Webed.form.field.CodeArea',
        'Webed.panel.ImageViewer',
        'Webed.panel.TextEditor'
    ],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {

        this.control ({
            'tab-manager': {
                render: this.render,
                beforeadd: this.beforeadd,
                remove: this.remove,
                tabchange: this.tabchange,
                focus: this.focus
            },

            'tab-manager text-editor': {
                beforeclose: this.beforeclose
            },

            'tab-manager image-viewer': {
                beforeclose: this.beforeclose
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

    render: function () {
        var menu = assert (Ext.fly ('cssmenu'));
        var item = menu.down ('li[active=True]');
        if (item) item.addCls ('active');
        var content_wrap = Ext.fly ('content-wrap');
        if (content_wrap) content_wrap.destroy ();
    },

    beforeadd: function () {
        assert (Ext.fly ('page-wrap')).setDisplayed (false);
    },

    remove: function (self) {
        if (self.items.length == 0) {
            assert (Ext.fly ('page-wrap')).setDisplayed (true);
        }
    },

    tabchange: function (tabPanel, newCard) {
        this.application.fireEvent ('select_node', this, {
            record: assert (newCard.record)
        });

        this.application.fireEvent ('select_leaf', this, {
            record: assert (newCard.record)
        });
    },

    focus: function (self) {
        var viewport = assert (this.getViewport ());
        var tab_managers = assert (viewport.query ('tab-manager'));

        tab_managers.forEach (function (tab_manager) {
            if (self != tab_manager) tab_manager.focused = false;
        });

        var active_tab = assert (self.getActiveTab ());
        this.application.fireEvent ('select_node', this, {
            record: assert (active_tab.record)
        });
        this.application.fireEvent ('select_leaf', this, {
            record: assert (active_tab.record)
        });

        self.focused = true;
    },

    beforeclose: function (component) {
        var tab_manager = assert (component.up ('tab-manager'));
        if (tab_manager.items.getCount () == 1) {

            var curr = tab_manager;
            var next = curr.up ('panel');

            while (next && next.query ('tab-manager').length == 1) {
                curr = next; next = next.up ('panel');
            }

            var tab_managers = Ext.ComponentQuery.query ('tab-manager');
            if (tab_managers.length > 1) { curr.close (); return false; }
        }

        return true;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    create_tab: function (source, args) {
        if (source == this) return;

        var record = assert (args.record);
        var mime = assert (record.get ('mime'));

        if (MIME.is_text (mime))
            this.create_text_tab (record, args.callback, args.scope);
        else if (MIME.is_image (mime))
            this.create_image_tab (record, args.callback, args.scope);
    },

    create_text_tab: function (record, callback, scope) {

        var application = assert (this.application);
        var tab_manager = assert (this.getTabManager ());
        var uuid = assert (record.get ('uuid'));

        var tab = this.get_tab (uuid);
        if (!tab) {

            function on_render (ca) {
                ca.setLoading ('Loading ..');

                application.fireEvent ('get_property', this, {
                    callback: on_get, scope: this, property: [{
                        node_uuid: uuid, name: 'data'
                    }]
                });

                function on_get (props) {
                    assert (props && props.length > 0);
                    var data = props[0].get ('data');
                    assert (data || data == '');

                    ca.setValue (data);
                    ca.setClean ();

                    if (callback && callback.call) {
                        callback.call (scope||this, props);
                    }

                    ca.setLoading (false);
                }
            }

            var code_area = Ext.create ('Webed.form.field.CodeArea', {
                mime: assert (record.get ('mime')), listeners: {
                    render: on_render
                }
            });

            var editor_tab = Ext.create ('Webed.panel.TextEditor', {
                record: record, codeArea: code_area
            });

            tab = tab_manager.add (editor_tab);
        }

        tab_manager.setActiveTab (tab);
    },

    create_image_tab: function (record, callback, scope) {

        var application = assert (this.application);
        var tab_manager = assert (this.getTabManager ());
        var uuid = assert (record.get ('uuid'));

        var tab = this.get_tab (uuid);
        if (!tab) {

            function on_render (self) {
                self.setLoading ('Loading ..');

                application.fireEvent ('get_property', this, {
                    callback: on_get, scope: this, property: [{
                        node_uuid: uuid, name: 'data'
                    }]
                });

                function on_get (props) {
                    assert (props && props.length > 0);
                    var data = props[0].get ('data');
                    assert (data || data == '');

                    self.add ({
                        xtype: 'image', src: data, listeners: {
                            afterrender: function (image) {
                                image.fireEvent ('load', image);
                            }
                        }
                    });

                    if (callback && callback.call) {
                        callback.call (scope||this, props);
                    }

                    self.setLoading (false);
                }
            }

            var viewer_tab = Ext.create ('Webed.panel.ImageViewer', {
                record: record, listeners: {render: on_render}
            });

            tab = tab_manager.add (viewer_tab);
        }

        tab_manager.setActiveTab (tab);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    update_tab: function (source, args) {
        if (source == this) return;

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

        var record = assert (tab.record);
        var uuid = assert (record.get ('uuid'));
        var ca = assert (tab.child ('code-area'));

        if (ca.getClean ()) {
            if (callback && callback.call) callback.call (
                scope||this, [], {success: true}
            );
        } else {
            var variation = ca.getValue ();
            assert (variation != null);
            var difference = ca.getDifference (variation);
            assert (difference != null);

            function on_get (props) {
                assert (props && props.length > 0);

                props[0].set ('data', difference);
                props[0].set ('size', utf8Length (variation.length));

                props[0].save ({
                    scope: this, callback: function (prop, op) {
                        props[0].set ('data', variation);

                        if (op.success) {
                            ca.setClean ();
                        }

                        if (callback && callback.call) callback.call (
                            scope||this, [prop], op
                        );
                    }
                });
            }

            this.application.fireEvent ('get_property', this, {
                callback: on_get, scope: this, property: [{
                    node_uuid: uuid, name: 'data'
                }]
            });
        }
    },

    update_image_tab: function (tab, callback, scope) {
        if (callback && callback.call) callback.call (
            scope||this, [], {success: true}
        );
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    rename_tab: function (source, args) {
        if (source == this) return;

        var uuid = assert (args.record.get ('uuid'));
        var name = assert (args.record.get ('name'));
        this.get_tabs (uuid).forEach (function (tab) {
            tab.setTitle (name);
        });
    },

    delete_tab: function (source, args) {
        if (source == this) return;

        var uuid = assert (args.record.get ('uuid'));
        this.get_tabs (uuid).forEach (function (tab) {
            tab.close ();
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_tab: function (uuid) {
        var tabs = this.get_tabs (uuid);
        var result = null;

        Ext.Array.each (tabs, function (tab) {
            var tab_manager = assert (tab.up ('tab-manager'));
            if (tab_manager.focused) result = tab;
            return result == null;
        });

        return (result) ? result : tabs.pop ();
    },

    get_tabs: function (uuid) {
        return assert (this.getViewport ()).queryBy (function (el) {
            return Boolean (el.record && el.record.get ('uuid') == uuid);
        }, this);
    }
});
