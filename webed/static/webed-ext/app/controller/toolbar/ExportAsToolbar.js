Ext.define ('Webed.controller.toolbar.ExportAsToolbar', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.control ({
            'main-toolbar button[action=export-project-as-pdf]': {
                click: this.exportProjectAsPdf
            },
            'main-toolbar button[action=export-project-as-html]': {
                click: this.exportProjectAsHtml
            },
            'main-toolbar button[action=export-project-as-latex]': {
                click: this.exportProjectAsLatex
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

    exportProjectAsPdf: function (button) {
        this.exportProject (button, '/rest-to-pdf/', 'Exporting PDF');
    },

    exportProjectAsHtml: function (button) {
        this.exportProject (button, '/rest-to-html/', 'Exporting HTML');
    },

    exportProjectAsLatex: function (button) {
        this.exportProject (button, '/rest-to-latex/', 'Exporting LaTex');
    },

    exportProject: function (button, url_base, message) {
        var node = assert (this.get_selection ());
        while (node.parentNode != null && node.parentNode.parentNode != null) {
            node = node.parentNode;
        }

        if (node.isRoot ()) return;
        button.disable ();

        var application = assert (this.application);
        application.fireEvent ('progress-play', this, {
            message: message
        });

        var uuid = assert (node.get ('uuid'));
        var url = url_base + '?node_uuid=' + uuid;

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
            console.error ('[ExportAsToolBar.exportProject]', xhr, opts);
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
