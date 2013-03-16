Ext.define ('Webed.controller.UploadBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_url: null, //@abstract
    get_root: null, //@abstract

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    change: function (field) {
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

    confirm: function () {
        var view = assert (this.getUploadBox ());
        var panel = assert (view.down ('form'));
        var form = assert (panel.getForm ());
        var application = assert (this.application);

        if (form.isValid ()) {
            form.submit ({
                url: this.get_url (),
                waitMsg: 'Uploading file ..',

                success: function () {
                    view.destroy ();
                    application.fireEvent ('refresh_tree');
                },

                failure: function () {
                    view.destroy ();
                    console.debug ('[UploadBox.confirmUpload]', 'failed');
                }
            });
        }
    },

    cancel: function () {
        assert (this.getUploadBox ()).destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
