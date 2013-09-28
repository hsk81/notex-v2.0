Ext.define ('Webed.controller.window.AddRestProjectBox', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'add-rest-project-box', ref: 'addRestProjectBox'
    }],

    init: function () {
        this.control ({
            'add-rest-project-box button[action=confirm]': {
                click: this.confirm
            },
            'add-rest-project-box button[action=cancel]': {
              click: this.cancel
            },
            'add-rest-project-box': {
                render: this.render,
                afterrender: this.afterrender
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    render: function (self) {
        var source = {}; for (var name in self.config) {
            if (self.config.hasOwnProperty (name)) {
                source[name] = self.getConfig (name);
            }
        }

        var grid = assert (self.down ('propertygrid'));
        grid.setSource (source);
    },

    afterrender: function (self) {
        var checkbox = assert (self.down ('checkbox[name=vcs]'));
        checkbox.setValue (self.vcs);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var box = assert (this.getAddRestProjectBox ());
        var mime = assert (box.mime);
        var vcs = assert (box.down ('checkbox[name=vcs]')).getValue ();
        var grid = assert (box.down ('propertygrid'));
        var source = Ext.apply (grid.getSource (), {
            mime: mime, vcs: vcs
        });

        var url = '/setup-rest-project/?' + Ext.Object.toQueryString ({
            name: source.project,
            mime: source.mime,
            authors: source.authors,
            documentType: source.documentType,
            fontSize: source.fontSize,
            noColumns: source.noColumns,
            titleFlag: source.titleFlag,
            tocFlag: source.tocFlag,
            indexFlag: source.indexFlag,
            backend: source.backend,
            vcs: source.vcs
        });

        function onSuccess (xhr) {
            var res = Ext.decode (xhr.responseText);
            assert (res.nodes && res.nodes.length > 0);
            assert (res.mime);

            var node = assert (res.nodes[0]);

            function callback (recs, op) {
                if (op.success) {
                    var records = recs.filter (function (rec) {
                        return rec.get ('uuid') == node.uuid;
                    });
                    application.fireEvent ('select_node', this, {
                        record: records[0]
                    });
                    records[0].expand ();
                } else {
                    console.error ('[AddProjectBox.confirm]', recs, op);
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

            console.error ('[AddRestProjectBox.confirm]', xhr, opts);
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
            }
        });

        box.close ();
    },

    cancel: function () {
        TRACKER.event ({
            category: 'AddProjectBox', action: 'cancel', value: 1
        });

        assert (this.getAddRestProjectBox ()).close ();
    }
});
