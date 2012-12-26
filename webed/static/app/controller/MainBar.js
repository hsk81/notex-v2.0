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
        console.debug ('[MainBar.openDocument]');
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    add: function (item, event, options) {
        this.addProject (item, event, options);
    },

    addProject: function (item, event, options) {
        message.prompt ({
            title: 'Add Project', msg: 'Enter a name:', value: 'Project',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, with: {
                        root_uuid: '00000000-0000-0000-0000-000000000000',
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

        var root_uuid = root.get ('expandable')
            ? root.get ('uuid') : root.parentNode.get ('uuid');
        assert (root_uuid);

        message.prompt ({
            title: 'Add Folder', msg: 'Enter a name:', value: 'folder',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, with: {
                        root_uuid: root_uuid,
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

        var root_uuid = root.get ('expandable')
            ? root.get ('uuid') : root.parentNode.get ('uuid');
        assert (root_uuid);

        message.prompt ({
            title: 'Add Text', msg: 'Enter a name:', value: 'file.txt',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                this.application.fireEvent ('create_leaf', {
                    scope: this, callback: callback, with: {
                        root_uuid: root_uuid,
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
                    if (!rec||!op||!op.success) {
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
