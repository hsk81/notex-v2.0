Ext.define ('Webed.controller.toolbar.ExportAsToolbar', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'webed-statusbar', ref: 'statusbar'
    }],

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
            },
            'main-toolbar button[action=export-project-as-text]': {
                click: this.exportProjectAsText
            },
            'main-toolbar button[action=export-project-as-epub]': {
                click: this.exportProjectAsEpub
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

    exportProjectAsText: function (button) {
        this.exportProject (button, '/rest-to-text/', 'Exporting Text');
    },

    exportProjectAsEpub: function (button) {
        this.exportProject (button, '/rest-to-epub/', 'Exporting EPUB');
    },

    exportProject: function (button, url_base, message) {
        var node = assert (this.get_selection ());
        while (node.parentNode != null && node.parentNode.parentNode != null) {
            node = node.parentNode;
        }

        var statusbar = assert (this.getStatusbar ());
        if (node.isRoot () || node.isLeaf ()) {

            statusbar.setStatus ({
                text: 'Select a project; none is selected.',
                iconCls: 'x-status-error',
                clear: true
            });

            return;
        }

        if (node.get ('mime') != 'application/project+rest') {

            statusbar.setStatus ({
                text: 'Conversion is only for <i>reStructuredText</i> ' +
                      'projects available.',
                iconCls: 'x-status-information',
                clear: true
            });

            return;
        }

        button.up ('panel').query ('button').forEach (function (item) {
            item.disable ();
        });

        var application = assert (this.application);
        application.fireEvent ('progress-play', this, {
            label: 'ExportAsToolbar.' + this.url2fn (url_base),
            message: message
        });

        var uuid = assert (node.get ('uuid'));
        var mime = assert (node.get ('mime'));
        var name = assert (node.get ('name'));
        var url = url_base + uuid;
        var me = this;

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
                category: 'ExportAsToolbar', action: me.url2fn (url_base),
                label: mime, value: 1
            });

            form.dom.submit ();
        }

        function onFailure (xhr, opts) {

            function failure_503 () {
                statusbar.setStatus ({
                    text: 'Conversion engine busy; please try later.',
                    iconCls: 'x-status-error',
                    clear: true
                });
            }

            function failure_513 () {
                var response = Ext.JSON.decode (xhr.responseText);

                assert (response);
                assert (response.meta);
                assert (response.meta.uuid);

                var href_url = '{0}/sphinx.err/{1}'.format (
                    location.origin, response.meta.uuid
                );

                var href_text = '<b>{0}</b>'.format (
                    'error logs'
                );

                var href = '<a href="{0}" target="_blank">{1}</a>'.format (
                    href_url, href_text
                );

                var status_text = 'Conversion failed; {0}!'.format (
                    'see {0} for further information'.format (href)
                );

                statusbar.setStatus ({
                    text: status_text,
                    iconCls: 'x-status-exclamation',
                    clear: true
                });

                var log = Ext.create ('Webed.window.LoggerBox', {
                    iconCls: 'icon-exclamation-16',
                    title: 'Exporting "{0}" failed'.format (name),
                    value: '..'
                });

                log.show ();
                log.setLoading (true);

                Ext.Ajax.request({
                    url: href_url + '/stdout.log',
                    method: 'GET',
                    success: function (xhr, opts) {
                        var ca = assert (log.down ('code-area'));
                        ca.setValue (xhr.responseText);
                        log.setLoading (false);
                    },
                    failure: function (xhr, opts) {
                        log.setLoading (false); console.error (
                            '[ExportAsToolBar.exportProject]', xhr, opts
                        );
                    }
                });
            }

            function failure_5xx () {
                statusbar.setStatus ({
                    text: "Conversion failed; check your project.",
                    iconCls: 'x-status-exclamation',
                    clear: true
                });
            }

            if (xhr.status == 503) failure_503 ();
            else if (xhr.status == 513) failure_513 ();
            else  failure_5xx ();

            TRACKER.event ({
                category: 'ExportAsToolbar', action: me.url2fn (url_base),
                label: mime, value: (xhr.status==503) ? Math.pow (2,31)-1 : 0
            });

            console.error ('[ExportAsToolBar.exportProject]', xhr, opts);
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

                application.fireEvent ('progress-stop', this, {
                    label: 'ExportAsToolbar.' + me.url2fn (url_base)
                });

                button.up ('panel').query ('button').forEach (function (item) {
                    item.enable ();
                });
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////

    url2fn: function (url) {
        switch (url) {
            case '/rest-to-pdf/':
                return 'export-project-as-pdf';
            case '/rest-to-html/':
                return 'export-project-as-html';
            case '/rest-to-latex/':
                return 'export-project-as-latex';
            default:
                return 'export-project';
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
