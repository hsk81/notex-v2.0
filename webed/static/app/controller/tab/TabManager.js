Ext.define ('Webed.controller.tab.TabManager', {
    extend: 'Ext.app.Controller',

    refs: [{
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

    beforeadd: function (view) {
        if (view.items.length == 0) {
            assert (Ext.fly ('page-wrap')).setDisplayed (false);
        }
    },

    remove: function (view) {
        if (view.items.length == 0) {
            assert (Ext.fly ('page-wrap')).setDisplayed (true);
        }
    },

    tabchange: function (tabPanel, newCard) {
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

        var application = assert (this.application);
        var view = assert (this.getTabManager ());
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

            tab = view.add (editor_tab);
        }

        view.setActiveTab (tab);
    },

    create_image_tab: function (record, callback, scope) {

        var application = assert (this.application);
        var view = assert (this.getTabManager ());
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
                        xtype: 'box', autoEl: {tag: 'img', src: data},
                        listeners: {render: function () {
                            Webed.controller.panel.ImageViewer.center (
                                self, 1
                            );
                        }}
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

            tab = view.add (viewer_tab);
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
        console.debug ('[update-image-tab]', tab, callback, scope);
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

        var view = assert (this.getTabManager ());
        var tabs = assert (view.queryBy (function (el) {
            return (el.record && el.record.get ('uuid') == uuid)
                ? true : false;
        }, this));

        return (tabs.length > 0) ? tabs[0] : null;
    }
});
