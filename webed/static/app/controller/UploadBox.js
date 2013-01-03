Ext.define ('Webed.controller.UploadBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'upload-box', ref: 'uploadBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'upload-box button[action=confirm]': { click: this.confirmUpload },
            'upload-box button[action=cancel]': { click: this.cancelUpload },
            'upload-box form filefield': { change: this.change }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    change: function (field, value, eOpts) {
        var path = field.getValue ();
        if (path) {
            var last = path.lastIndexOf ('\\');
            if (last > -1) {
                var name = path.substring (last+1);
                field.setRawValue (name);
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirmUpload: function (button, event, eOpts) {
        var application = this.application;
        assert (application);
        var view = this.getUploadBox ();
        assert (view);
        var panel = view.down ('form');
        assert (panel);
        var form = panel.getForm ();
        assert (form);
        var root = this.get_selection ();
        assert (root);

        if (root.isLeaf ()) {
            assert (root.parentNode);
            root = root.parentNode;
        }

        var root_uuid = root.get ('uuid');
        assert (root_uuid);

        if (form.isValid ()) {
            form.submit ({
                url: '/upload/?root_uuid=' + root_uuid,
                waitMsg: 'Uploading your file..',

                success: function (form, action) {
                    assert (view); view.hide ();
                    application.fireEvent ('upload_success', form, action);
                },

                failure: function (form, action) {
                    assert (view); view.hide ();
                    application.fireEvent ('upload_failure', form, action);
                }
            });
        }
    },

    cancelUpload: function (item, event, options) {
        var view = this.getUploadBox ();
        assert (view); view.hide ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_selection: function () {
        return this.application.get_selection ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
