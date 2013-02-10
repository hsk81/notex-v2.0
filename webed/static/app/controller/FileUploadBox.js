Ext.define ('Webed.controller.FileUploadBox', {
    extend: 'Webed.controller.UploadBox',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'file-upload-box', ref: 'uploadBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'file-upload-box button[action=confirm]': {
                click: this.confirm
            },
            'file-upload-box button[action=cancel]': {
                click: this.cancel
            },
            'file-upload-box form filefield': {
                change: this.change
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_url: function () {
        var root = this.application.get_selection ();
        assert (root);

        if (root.isLeaf ()) {
            assert (root.parentNode);
            root = root.parentNode;
        }

        var root_uuid = root.get ('uuid');
        assert (root_uuid);

        return Ext.String.format ('/file-upload/?root_uuid={0}', root_uuid);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
