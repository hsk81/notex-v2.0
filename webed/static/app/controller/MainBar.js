Ext.define ('Webed.controller.MainBar', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        var controller = this.application.getController ('NodeTree');
        assert (controller); return controller.get_selection ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'main-bar button[action=save-document]': {
                click: this.saveDocument
            },
            'main-bar button[action=open-document]': {
                click: this.openDocument
            },
            'main-bar splitbutton[action=add]': {
                click: this.add
            },
            'main-bar menuitem[action=add-project]': {
                click: this.addProject
            },
            'main-bar menuitem[action=add-folder]': {
                click: this.addFolder
            },
            'main-bar menuitem[action=add-text]': {
                click: this.addText
            },
            'main-bar button[action=rename]': {
                click: this.rename
            },
            'main-bar button[action=delete]': {
                click: this.destroy
            },
            'main-bar button[action=import-project]': {
                click: this.importProject
            },
            'main-bar button[action=export-project]': {
                click: this.exportProject
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    saveDocument: function (item, event, options) {
        var node = this.get_selection ();
        assert (node);

        this.application.fireEvent ('update_tab', this, {
            scope: this, callback: callback, record: node
        });

        function callback (records, op) {
            if (!records||!op||!op.success) {
                console.error ('[MainBar.saveDocument]', records, op);
            }
        }
    },

    openDocument: function (item, event, options) {
        var root = this.get_selection ();
        assert (root);

        if (root.isLeaf ()) {
            assert (root.parentNode);
            root = root.parentNode;
        }

        var root_uuid = root.get ('uuid');
        assert (root_uuid);
        var application = this.application;
        assert (application);

        var window = Ext.create ('Ext.window.Window', {

            border: false,
            iconCls: 'icon-folder_page-16',
            layout: 'fit',
            modal: true,
            resizable: false,
            title: 'Open File',
            width: 320,

            items: [{
                xtype: 'form',
                border: false,
                layout: 'fit',

                items: [{
                    border: false,
                    xtype: 'filefield',
                    allowBlank: false,
                    anchor: '100%',
                    buttonText: 'Select..',
                    msgTarget: 'none',
                    name: 'file',

                    listeners: {
                        change: function (self, value, eOpts) {
                            var path = this.getValue ();
                            if (path) {
                                var last = path.lastIndexOf ('\\');
                                if (last > -1) {
                                    var name = path.substring (last+1);
                                    this.setRawValue (name);
                                }
                            }
                        }
                    }
                }]
            }],

            buttons: [{
                text: 'Upload',
                iconCls : 'icon-tick-16',
                handler: function () {
                    var window = this.up ('window'); assert (window);
                    var panel = window.down ('form'); assert (panel);
                    var form = panel.getForm (); assert (form);
                    if (form.isValid ()) {
                        form.submit ({
                            url: '/upload/?root_uuid=' + root_uuid,
                            waitMsg: 'Uploading your file..',

                            success: function (form, action) {
                                assert (window); window.hide ();
                                application.fireEvent ('refresh_tree');
                            },

                            failure: function (form, action) {
                                assert (window); window.hide ();
                                console.error ('[MainBar.openDocument]',
                                    form, action);
                            }
                        });
                    }
                }
            },{
                text : 'Cancel',
                iconCls : 'icon-cross-16',
                handler : function () {
                    var window = this.up ('window');
                    assert (window); window.hide ();
                }
            }]
        });

        window.show ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    add: function (item, event, options) {
        this.addProject (item, event, options);
    },

    addProject: function (item, event, options) {
        var root = Ext.getStore ('Nodes').getRootNode ();
        assert (root);

        message.prompt ({
            title: 'Add Project', msg: 'Enter a name:', value: 'Project',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, with: {
                        root: root,
                        mime: 'application/project',
                        name: text
                    }
                });

                function callback (rec, op) {
                    if (!rec||!op||!op.success) {
                        console.error ('[MainBar.addProject]', rec, op);
                    }
                }
            }
        });
    },

    addFolder: function (item, event, options) {
        var root = this.get_selection ();
        assert (root);

        if (root.isLeaf ()) {
            assert (root.parentNode);
            root = root.parentNode;
        }

        message.prompt ({
            title: 'Add Folder', msg: 'Enter a name:', value: 'folder',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, with: {
                        root: root,
                        mime: 'application/folder',
                        name: text
                    }
                });

                function callback (rec, op) {
                    if (!rec||!op||!op.success) {
                        console.error ('[MainBar.addFolder]', rec, op);
                    }
                }
            }
        });
    },

    addText: function (item, event, options) {
        var root = this.get_selection ();
        assert (root);

        if (root.get ('leaf')) {
            assert (root.parentNode);
            root = root.parentNode;
        }

        message.prompt ({
            title: 'Add Text', msg: 'Enter a name:', value: 'file.txt',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                this.application.fireEvent ('create_leaf', {
                    scope: this, callback: callback, with: {
                        root: root,
                        mime: 'text/plain',
                        name: text,
                        size: 4
                    }
                });

                function callback (leaf, op) {
                    if (leaf && op && op.success) {
                        this.application.fireEvent ('set_property', this, {
                            scope: this, callback: on_set, property: [{
                                node_uuid: leaf.get ('uuid'),
                                name: 'data',
                                data: '....',
                                size: 4,
                                mime: 'text/plain',
                                type: 'TextProperty'
                            }]
                        });

                        function on_set (prop, op) {
                            if (!prop||!op||!op.success) {
                                error (prop, op);
                            }
                        }
                    } else {
                        error (leaf, op);
                    }
                }

                function error (rec, op) {
                    console.error ('[MainBar.addText]', rec, op);
                }
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    rename: function (item, event, options) {
        var node = this.get_selection ();
        assert (node);

        if (node.get ('uuid') == '00000000-0000-0000-0000-000000000000') {
            return;
        }

        message.prompt ({
            title: 'Rename', value: node.get ('name'),
            scope: this, fn: function (button, text) {
                if (button!='ok' || text==node.get ('name') || text=='') {
                    return;
                }

                this.application.fireEvent ('update_node', {
                    scope: this, callback: callback, for: node, to: {
                        name: text
                    }
                });

                function callback (rec, op) {
                    if (rec && op && op.success) {
                        this.application.fireEvent ('rename_tab', this, {
                            record: rec
                        });
                        this.application.fireEvent ('reload_leaf', this, {
                            record: rec
                        });
                    } else {
                        console.error ('[MainBar.rename]', rec, op);
                    }
                }
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    destroy: function (item, event, options) {
        var node = this.get_selection ();
        assert (node);

        if (node.get ('uuid') == '00000000-0000-0000-0000-000000000000') {
            return;
        }

        message.confirm ({
            title: 'Delete',

            msg: Ext.String.format (
                'Are you sure, do you want to delete <i>{0}</i>?',
                node.get ('name')
            ),

            scope: this, fn: function (button) {
                if (button != 'yes') return;

                this.application.fireEvent ('delete_node', {
                    scope: this, callback: callback, for: node
                });

                function callback (rec, op) {
                    if (rec && op && op.success) {
                        this.application.fireEvent ('delete_tab', this, {
                            record: rec
                        });
                        this.application.fireEvent ('reload_leaf', this, {
                            record: rec
                        });
                    } else {
                        console.error ('[MainBar.destroy]', rec, op);
                    }
                }
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    importProject: function (item, event, options) {
        console.debug ('[MainBar.importProject]');
    },

    exportProject: function (item, event, options) {
        console.debug ('[MainBar.exportProject]');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
