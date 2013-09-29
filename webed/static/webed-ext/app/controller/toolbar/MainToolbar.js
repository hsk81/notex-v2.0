Ext.define ('Webed.controller.toolbar.MainToolbar', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'webed-statusbar', ref: 'statusbar'
    }],

    init: function () {
        this.control ({
            'main-toolbar button[action=save-document]': {
                click: this.saveDocument
            },
            'main-toolbar menuitem[action=annotate-document]': {
                click: this.annotateDocument
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
            'main-toolbar button[action=show-git-history]': {
                click: this.showGitHistory
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
        if (!node.isLeaf ()) {
            assert (this.getStatusbar ()).setStatus ({
                text: 'Select a file; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        assert (button).disable ();

        var application = assert (this.application);
        application.fireEvent ('progress-play', this, {
            message: 'Saving', label: 'MainToolbar.save-document'
        });

        function callback (records, op) {
            if (!records||!op||!op.success) {
                console.error ('[MainBar.saveDocument]', records, op);
            }

            application.fireEvent ('progress-stop', this, {
                label: 'MainToolbar.save-document'
            });

            button.enable ();
        }

        application.fireEvent ('update_tab', this, {
            scope: this, callback: callback, record: node
        });
    },

    annotateDocument: function () {
        var node = assert (this.get_selection ());
        if (!node.isLeaf ()) {
            assert (this.getStatusbar ()).setStatus ({
                text: 'Select a file; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        var annotateBox = Ext.create ('Webed.window.AnnotateBox', {
            title: Ext.String.format ('Annotate {0}', node.getTitle ()),
            iconCls: node.get ('iconCls'),
            record: node
        });

        annotateBox.show ();
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
        if (node.isRoot ()) {
            assert (this.getStatusbar ()).setStatus ({
                text: 'Select a project or file; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        var renameBox = Ext.create ('Webed.window.RenameBox', {
            title: Ext.String.format ('Rename {0}', node.getTitle ()),
            iconCls: node.get ('iconCls'),
            record: node
        });

        renameBox.show ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    destroy: function () {
        var node = assert (this.get_selection ());
        if (node.isRoot ()) {
            assert (this.getStatusbar ()).setStatus ({
                text: 'Select a project or file; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        var deleteBox = Ext.create ('Webed.window.DeleteBox', {
            title: Ext.String.format ('Delete {0}?', node.getTitle ()),
            iconCls: node.get ('iconCls'),
            record: node
        });

        deleteBox.show ();
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
            assert (this.getStatusbar ()).setStatus ({
                text: 'Select a project or file; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        assert (button).disable ();

        var application = assert (this.application);
        application.fireEvent ('progress-play', this, {
            message: 'Exporting', label: 'MainToolbar.export-project'
        });

        var uuid = assert (node.get ('uuid'));
        var mime = assert (node.get ('mime'));
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

            TRACKER.event ({
                category: 'MainToolbar', action: 'export-project', label: mime,
                value: 1
            });

            form.dom.submit ();
        }

        function onFailure (xhr, opts) {
            TRACKER.event ({
                category: 'MainToolbar', action: 'export-project', label: mime,
                value: 1
            });

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

                application.fireEvent ('progress-stop', this, {
                    label: 'MainToolbar.export-project'
                });

                button.enable ();
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    showGitHistory: function () {
        var me = this,
            node = up (assert (this.get_selection (), '306'));

        function up (node) {
            while (node.parentNode != null &&
                node.parentNode.parentNode != null) {
                node = node.parentNode;
            }

            return node
        }

        if (node.isRoot ()) {
            var statusbar = assert (me.getStatusbar (), '318');
            statusbar.setStatus ({
                text: 'Select a project or file; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        var mime = assert (node.get ('mime'), '328');
        var not_project = !MIME.is_project (mime);
        var traversor = new Traversor (node, 'childNodes');

        traversor.traverse ({
            scope: this, callback: function (node) {
                var mime = assert (node.get ('mime'), '334');
                if (MIME.is_folder (mime)) return;
                var uuid = assert (node.get ('uuid'), '336');

                this.application.fireEvent ('get_property', this, {
                    scope: this, callback: on_get_property, property: [{
                        node_uuid: uuid, name: 'meta'
                    }]
                });
            }
        });

        function on_get_property (props) {
            if (props && props.length > 0) {
                var array = ['Base64VcsProperty', 'TextVcsProperty'];
                var data = assert (props[0].get ('data'), '349');
                var meta = Ext.JSON.decode (data);
                var type = assert (meta.type, '351');

                if (Ext.Array.contains (array, type)) {
                    traversor.doStop (); do_show_history ();
                } else {
                    if (not_project) do_show_disabled ();
                }
            } else {
                if (!traversor.isStopped ()) do_show_disabled ();
            }
        }

        function do_show_disabled () {
            var statusbar = assert (me.getStatusbar (), '364');
            statusbar.setStatus ({
                text: 'GIT versioning not enabled!',
                iconCls: 'x-status-error',
                clear: true
            });
        }

        function do_show_history () {
            var uuid = assert (node.get ('uuid'), '373');
            var mime = assert (node.get ('mime'), '374');

            var protocol = location.protocol;
            var host = ((location.hostname == 'localhost' ||
                location.hostname == '127.0.0.1') && location.port != 80)
                    ? '{0}:{1}'.format (location.hostname, 8008)
                    : location.host;
            var path = 'git/?p={0}'.format (uuid);
            var uri = '{0}//{1}/{2}'.format (protocol, host, path);

            var tab = window.open (uri, '_blank');
            if (tab) tab.focus();

            TRACKER.event ({
                category: 'MainToolbar', action: 'show-git-history',
                label: mime, value: 1
            });
        }
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
        shift: false,
        defaultEventAction: 'stopEvent',
        handler: function () {
            var query = 'main-toolbar button[action=save-document]';
            var button = assert (Ext.ComponentQuery.query (query).pop ());
            assert (this.getController ()).saveDocument (button);
        }
    },{
        key: 's',
        ctrl: true,
        shift: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).annotateDocument ();
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
    },{
        key: 'h',
        ctrl: true,
        shift: true,
        defaultEventAction: 'stopEvent',
        handler: function () {
            assert (this.getController ()).showGitHistory ();
        }
    }]
});
