Ext.define ('Webed.controller.window.AddProjectBox', {
    extend: 'Ext.app.Controller',

    requires: [
        'Webed.window.AddRestProjectBox'
    ],

    refs: [{
        selector: 'add-project-box', ref: 'addProjectBox'
    }],

    init: function () {
        this.control ({
            'add-project-box button[action=confirm]': {
                click: this.confirm
            },
            'add-project-box button[action=cancel]': {
                click: this.cancel
            },
            'add-project-box textfield[name=name]': {
                afterrender: this.afterrender,
                blur: this.blur
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    blur: function (textfield) {
        if (textfield.autofocus) {
            textfield.focus (true, 25);
            textfield.autofocus = false;
        }
    },

    afterrender: function (textfield) {
        textfield.autofocus = true;
        textfield.focus (true, 25);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var box = assert (this.getAddProjectBox ());
        var textfield = assert (box.down ('textfield[name=name]'));
        var combobox = assert (box.down ('combobox[name=mime]'));

        if (!textfield.isValid ()) return;
        var project = assert (textfield.getValue ());
        if (!combobox.isValid ()) return;
        var mime = assert (combobox.getValue ());

        switch (mime) {
            case 'application/project+latex':
                this.setup_latex_project (project, mime);
                break;
            case 'application/project+md':
                this.setup_latex_project (project, mime);
                break;
            case 'application/project+rest':
                this.setup_rest_project (project, mime);
                break;
            default:
                this.setup_generic_project (project, mime);
        }

        box.close ();
    },

    cancel: function () {
        TRACKER.event ({
            category: 'AddProjectBox', action: 'cancel', value: 1
        });

        assert (this.getAddProjectBox ()).close ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    setup_latex_project: function (project, mime) {
        this.setup_project ('/setup-latex-project/', project, mime);
    },

    setup_markdown_project: function (project, mime) {
        this.setup_project ('/setup-markdown-project/', project, mime);
    },

    setup_rest_project: function (project, mime) {
        var box = Ext.create ('Webed.window.AddRestProjectBox', {
            project: project, mime: mime
        });

        box.show ();
    },

    setup_generic_project: function (project, mime) {
        this.setup_project ('/setup-generic-project/', project, mime);
    },

    setup_project: function (url_base, project, mime) {
        var application = assert (this.application);
        var url = Ext.String.format (url_base + '?name={0}&mime={1}',
            encodeURIComponent (project), encodeURIComponent (mime)
        );

        function onSuccess (xhr) {
            var res = Ext.decode (xhr.responseText);
            assert (res.nodes && res.nodes.length > 0);
            assert (res.mime);

            var node = assert (res.nodes[0]);

            function callback (recs, op) {
                if (op && op.success) {
                    var records = recs.filter (function (rec) {
                        return rec.get ('uuid') == node.uuid;
                    });
                    application.fireEvent ('select_node', this, {
                        record: records[0]
                    });
                    records[0].expand ();
                } else {
                    console.error ('[AddProjectBox.setup_project]', recs, op);
                }

                TRACKER.event ({
                    category: 'AddProjectBox', action: 'confirm', label: mime,
                    value: (op && op.success) ? 1 : 0
                });
            }

            application.fireEvent ('refresh_tree', this, {
                scope: this, callback: callback
            });
        }

        function onFailure (xhr, opts) {
            TRACKER.event ({
                category: 'AddProjectBox', action: 'confirm', label: mime,
                value: 0
            });

            console.error ('[AddProjectBox.setup_project]', xhr, opts);
        }

        Ext.Ajax.request ({
            url: url, scope: this, callback: function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText);
                    if (res.success) onSuccess.call (this, xhr, opts);
                    else onFailure.call (this, xhr, opts);
                } else {
                    onFailure.call (this, xhr, opts);
                }
            }
        });
    }
});
