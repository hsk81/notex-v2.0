Ext.define ('Webed.controller.toolbar.MainToolbar', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.control ({
            'main-toolbar button[action=save-document]': {
                click: this.saveDocument
            },
            'main-toolbar button[action=open-document]': {
                click: this.openDocument
            },
            'main-toolbar splitbutton[action=add]': {
                click: this.add
            },
            'main-toolbar menuitem[action=add-project]': {
                click: this.addProject
            },
            'main-toolbar menuitem[action=add-folder]': {
                click: this.addFolder
            },
            'main-toolbar menuitem[action=add-file]': {
                click: this.addFile
            },
            'main-toolbar button[action=rename]': {
                click: this.rename
            },
            'main-toolbar button[action=delete]': {
                click: this.destroy
            },
            'main-toolbar button[action=import-project]': {
                click: this.importProject
            },
            'main-toolbar button[action=export-project]': {
                click: this.exportProject
            },
            'main-toolbar': {
                afterrender: this.afterrender
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        return this.application.get_selection ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    afterrender: function () {
        this.keyMap = Ext.create (
            'Webed.controller.toolbar.MainToolbar.KeyMap', {
                controller: this
            }
        );
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    saveDocument: function (button) {
        var node = assert (this.get_selection ());
        if (!node.isLeaf ()) return;
        assert (button).disable ();

        var application = assert (this.application);
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
        Ext.create ('Webed.window.FileUploadBox').show ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    add: function () {
        this.addProject ();
    },

    addProject: function () {
        Ext.create ('Webed.window.AddProjectBox').show ();
    },

    addFolder: function () {
        var addFolderBox = Ext.create ('Webed.window.AddFolderBox', {
            record: assert (this.get_selection ())
        });

        addFolderBox.show ();
    },

    addFile: function () {
        var addFileBox = Ext.create ('Webed.window.AddFileBox', {
            record: assert (this.get_selection ())
        });

        addFileBox.show ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    rename: function () {
        var node = assert (this.get_selection ());
        if (node.isRoot () == false) {
            var renameBox = Ext.create ('Webed.window.RenameBox', {
                title: Ext.String.format ('Rename {0}', node.getTitle ()),
                iconCls: node.get ('iconCls'),
                record: node
            });

            renameBox.show ();
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    destroy: function () {
        var node = assert (this.get_selection ());
        if (node.isRoot () == false) {
            var deleteBox = Ext.create ('Webed.window.DeleteBox', {
                title: Ext.String.format ('Delete {0}?', node.getTitle ()),
                iconCls: node.get ('iconCls'),
                record: node
            });

            deleteBox.show ();
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    importProject: function () {
        Ext.create ('Webed.window.ArchiveUploadBox').show ();
    },

    exportProject: function (button) {
        var node = assert (this.get_selection ());
        while (node.parentNode != null && node.parentNode.parentNode != null) {
            node = node.parentNode;
        }

        if (node.isRoot ()) {
            return;
        }

        assert (button).disable ();
        var application = assert (this.application);
        application.fireEvent ('progress-play', this, {message: 'Exporting'});

        var uuid = assert (node.get ('uuid'));
        var url = '/archive-download/' + uuid;

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
                action: url + '?fetch=true',
                target: 'iframe'
            });

            form.dom.submit ();
        }

        function onFailure (xhr, opts) {
            console.error ('[MainToolbar.exportProject]', xhr, opts);
        }

        Ext.Ajax.request ({
            url: url, scope: this, callback: function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText);
                    if (res.success) onSuccess (xhr, opts);
                    else onFailure (xhr, opts);
                } else {
                    onFailure (xhr, opts);
                }

                application.fireEvent ('progress-stop', this);
                button.enable ();
            }
        });
    }
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.define ('Webed.controller.toolbar.MainToolbar.KeyMap', {
    extend: 'Ext.util.KeyMap',

    config: {
        target: Ext.getDoc (),
        controller: null
    },

    constructor: function (config) {
        this.callParent (arguments);
        this.initConfig (config);
    },

    binding: [{
        key: 's',
        ctrl: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            var query = 'main-toolbar button[action=save-document]';
            var button = assert (Ext.ComponentQuery.query (query).pop ());
            assert (this.getController ()).saveDocument (button);
        }
    },{
        key: 'o',
        ctrl: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).openDocument ();
        }
    },{
        key: 'p',
        alt: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).addProject ();
        }
    },{
        key: 'f',
        alt: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).addFolder ();
        }
    },{
        key: 'd',
        alt: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).addFile ();
        }
    },{
        key: Ext.EventObject.F2,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).rename ();
        }
    },{
        key: Ext.EventObject.DELETE,
        ctrl: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).destroy ();
        }
    },{
        key: 'i',
        ctrl: true,
        shift: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).importProject ();
        }
    },{
        key: 'e',
        ctrl: true,
        shift: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            var query = 'main-toolbar button[action=export-project]';
            var button = assert (Ext.ComponentQuery.query (query).pop ());
            assert (this.getController ()).exportProject (button);
        }
    }]
});
