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
        var view = this.getUploadBox ();
        assert (view);
        var panel = view.down ('form');
        assert (panel);
        var form = panel.getForm ();
        assert (form);
        var app = this.application;
        assert (app);

        if (form.isValid ()) {
            form.submit ({
                url: this.get_url (),
                waitMsg: 'Uploading file ..',

                success: function () {
                    assert (view); view.destroy ();
                    app.fireEvent ('refresh_tree');
                },

                failure: function () {
                    assert (view); view.destroy ();
                    console.debug ('[UploadBox.confirmUpload]', 'failed');
                }
            });
        }
    },

    cancel: function () {
        var view = this.getUploadBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
