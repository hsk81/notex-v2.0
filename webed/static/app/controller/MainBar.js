Ext.define ('Webed.controller.MainBar', {
    extend: 'Ext.app.Controller',

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

    saveDocument: function (button) {
        var node = this.get_selection ();
        assert (node); if (!node.isLeaf ()) return;
        assert (button); button.disable ();

        var application = this.application;
        assert (application);
        application.fireEvent ('progress-play', this, {
            message: 'Saving'
        });
        application.fireEvent ('update_tab', this, {
            scope: this, callback: callback, record: node
        });

        function callback (records, op) {
            if (!records||!op||!op.success) {
                console.error ('[MainBar.saveDocument]', records, op);
            }

            application.fireEvent ('progress-stop', this);
            button.enable ();
        }
    },

    openDocument: function () {
        Ext.create ('Webed.view.FileUploadBox').show ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    add: function () {
        this.addProject ();
    },

    addProject: function () {
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

    addFolder: function () {
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

    addText: function () {
        var root = this.get_selection ();
        assert (root);

        if (root.get ('leaf')) {
            assert (root.parentNode);
            root = root.parentNode;
        }

        var application = this.application;
        assert (application);

        message.prompt ({
            title: 'Add Text', msg: 'Enter a name:', value: 'file.txt',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                application.fireEvent ('create_leaf', {
                    scope: this, callback: callback, with: {
                        root: root,
                        mime: 'text/plain',
                        name: text,
                        size: 4
                    }
                });

                function callback (leaf, op) {
                    if (leaf && op && op.success) {
                        application.fireEvent ('set_property', this, {
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

    rename: function () {
        var node = this.get_selection ();
        assert (node);
        var uuid = node.get ('uuid');
        assert (uuid);

        if (uuid == '00000000-0000-0000-0000-000000000000') {
            return;
        }

        var application = this.application;
        assert (application);

        message.prompt ({
            title: 'Rename', value: node.get ('name'),
            scope: this, fn: function (button, text) {
                if (button!='ok' || text==node.get ('name') || text=='') {
                    return;
                }

                application.fireEvent ('update_node', {
                    scope: this, callback: callback, for: node, to: {
                        name: text
                    }
                });

                function callback (rec, op) {
                    if (rec && op && op.success) {
                        application.fireEvent ('rename_tab', this, {
                            record: rec
                        });
                        application.fireEvent ('reload_leaf', this, {
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

    destroy: function () {
        var node = this.get_selection ();
        assert (node);
        var uuid = node.get ('uuid');
        assert (uuid);

        if (uuid == '00000000-0000-0000-0000-000000000000') {
            return;
        }

        var application = this.application;
        assert (application);

        message.confirm ({
            title: 'Delete',

            msg: Ext.String.format (
                'Are you sure, do you want to delete <i>{0}</i>?',
                node.get ('name')
            ),

            scope: this, fn: function (button) {
                if (button != 'yes') return;

                application.fireEvent ('delete_node', {
                    scope: this, callback: callback, for: node
                });

                function callback (rec, op) {
                    if (rec && op && op.success) {
                        application.fireEvent ('delete_tab', this, {
                            record: rec
                        });
                        application.fireEvent ('reload_leaf', this, {
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

    importProject: function () {
        Ext.create ('Webed.view.ArchiveUploadBox').show ();
    },

    exportProject: function (button) {
        var node = this.get_selection (); assert (node);
        while (node.parentNode != null && node.parentNode.parentNode != null) {
            node = node.parentNode;
        }

        if (node.isRoot ()) {
            return;
        }

        assert (button); button.disable ();
        var application = this.application; assert (application);
        application.fireEvent ('progress-play', this, {message: 'Exporting'});

        var uuid = node.get ('uuid'); assert (uuid);
        var url = '/archive-download/?node_uuid=' + uuid;

        Ext.Ajax.request ({
            url: url, scope: this, callback: function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText);
                    if (res.success) onSuccess (xhr, opts);
                    else onFailure (xhr, opts, res);
                } else {
                    onFailure (xhr, opts);
                }

                application.fireEvent ('progress-stop', this);
                button.enable ();
            }
        });

        function onSuccess (xhr, opts) {
            var body = Ext.getBody ();

            var old_frame = Ext.get ('iframe');
            if (old_frame != null) Ext.destroy (old_frame);

            var new_frame = body.createChild ({
                tag: 'iframe',
                cls: 'x-hidden',
                id: 'iframe',
                name: 'iframe'
            });

            var form = body.createChild ({
                tag: 'form',
                cls: 'x-hidden',
                id: 'form',
                method: 'POST',
                action: url + '&fetch=true',
                target: 'iframe'
            });

            form.dom.submit ();
        }

        function onFailure (xhr, opts, res) {
            console.error ('[MainBar.exportProject]', xhr, opts, res)
        }
   },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        return this.application.get_selection ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
