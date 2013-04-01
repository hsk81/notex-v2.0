Ext.define ('Webed.controller.window.FileUploadBox', {
    extend: 'Webed.controller.window.UploadBox',

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
        var root = assert (this.application.get_selection ());
        if (root.isLeaf ()) root = assert (root.parentNode);

        return Ext.String.format (
            '/file-upload/?root_uuid={0}', assert (root.get ('uuid'))
        );
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
