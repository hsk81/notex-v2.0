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
            },
            'main-bar': {
                afterrender: this.afterrender
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    afterrender: function () {
        this.keyMap = Ext.create ('Webed.controller.MainBar.KeyMap', {
            controller: this
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
        Ext.create ('Webed.view.AddProjectBox').show ();
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

        function onFailure (xhr, opts) {
            console.error ('[MainBar.exportProject]', xhr, opts);
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
   },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        return this.application.get_selection ();
    }
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.define ('Webed.controller.MainBar.KeyMap', {
    extend: 'Ext.util.KeyMap',

    config: {
        target: Ext.getDoc (),
        controller: null
    },

    constructor: function (config) {
        this.callParent (arguments);
        this.initConfig (config);
        assert (this.target);
        assert (this.controller);
    },

    binding: [{
        key: 's',
        ctrl: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            var buttonQuery = 'main-bar button[action=save-document]';
            var button = Ext.ComponentQuery.query (buttonQuery).pop ();
            assert (button); this.getController ().saveDocument (button);
        }
    },{
        key: 'o',
        ctrl: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().openDocument ();
        }
    },{
        key: 'p',
        alt: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().addProject ();
        }
    },{
        key: 'f',
        alt: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().addFolder ();
        }
    },{
        key: 'd',
        alt: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().addFile ();
        }
    },{
        key: Ext.EventObject.F2,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().rename ();
        }
    },{
        key: Ext.EventObject.DELETE,
        ctrl: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().destroy ();
        }
    },{
        key: 'i',
        ctrl: true,
        shift: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            this.getController ().importProject ();
        }
    },{
        key: 'e',
        ctrl: true,
        shift: true,
        defaultEventAction: 'stopEvent',
        handler: function (key, event) {
            var buttonQuery = 'main-bar button[action=export-project]';
            var button = Ext.ComponentQuery.query (buttonQuery).pop ();
            assert (button); this.getController ().exportProject (button);
        }
    }],

    getController: function () { return this.controller; }
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
