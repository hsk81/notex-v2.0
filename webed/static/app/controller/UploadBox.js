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

    confirmUpload: function () {
        var application = this.application;
        assert (application);
        var view = this.getUploadBox ();
        assert (view);
        var panel = view.down ('form');
        assert (panel);
        var form = panel.getForm ();
        assert (form);

        var url = this.get_url ();
        assert (url);
        var root = this.get_root ();
        assert (root);

        if (root.isLeaf ()) {
            assert (root.parentNode); root = root.parentNode;
        }

        var root_uuid = root.get ('uuid');
        assert (root_uuid);

        if (form.isValid ()) {
            form.submit ({
                url: Ext.String.format ('{0}/?root_uuid={1}', url, root_uuid),
                waitMsg: 'Uploading your file..',

                success: function () {
                    assert (view); view.destroy ();
                    application.fireEvent ('refresh_tree');
                },

                failure: function () {
                    assert (view); view.destroy ();
                    console.debug ('[UploadBox.confirmUpload]', 'failed');
                }
            });
        }
    },

    cancelUpload: function () {
        var view = this.getUploadBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
