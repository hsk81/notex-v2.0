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
            'main-bar menuitem[action=add-file]': {
                click: this.addFile
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

        function callback (records, op) {
            if (!records||!op||!op.success) {
                console.error ('[MainBar.saveDocument]', records, op);
            }

            application.fireEvent ('progress-stop', this);
            button.enable ();
        }

        application.fireEvent ('update_tab', this, {
            scope: this, callback: callback, record: node
        });
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

                function callback (rec, op) {
                    if (!rec||!op||!op.success) {
                        console.error ('[MainBar.addProject]', rec, op);
                    }
                }

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, with: {
                        root: root,
                        mime: 'application/project',
                        name: text
                    }
                });
            }
        });
    },

    addFolder: function () {
        var node = this.get_selection ();
        assert (node);

        var addFolderBox = Ext.create ('Webed.view.AddFolderBox', {
            node: node
        });

        addFolderBox.show ();
    },

    addFile: function () {
        var node = this.get_selection ();
        assert (node);

        var addFileBox = Ext.create ('Webed.view.AddFileBox', {
            node: node
        });

        addFileBox.show ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    rename: function () {
        var node = this.get_selection ();
        assert (node);

        if (!node.isRoot ()) {
            var renameBox = Ext.create ('Webed.view.RenameBox', {
                title: Ext.String.format ('Rename {0}', node.getTitle (true)),
                iconCls: node.get ('iconCls'),
                node: node
            });

            renameBox.show ();
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    destroy: function () {
        var node = this.get_selection ();
        assert (node);

        if (!node.isRoot ()) {
            var deleteBox = Ext.create ('Webed.view.DeleteBox', {
                title: Ext.String.format ('Delete {0}', node.getTitle (true)),
                iconCls: node.get ('iconCls'),
                node: node
            });

            deleteBox.show ();
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    importProject: function () {
        Ext.create ('Webed.view.ArchiveUploadBox').show ();
    },

    exportProject: function (button) {
        var node = this.get_selection ();
        assert (node);

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
   },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        return this.application.get_selection ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
