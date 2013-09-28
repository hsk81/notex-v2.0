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
        var view = assert (this.getUploadBox ());
        var checkbox = assert (view.down ('checkbox[name=vcs]'));
        var vcs = checkbox.getValue ();

        var root = assert (this.application.get_selection ());
        if (root.isLeaf ()) root = assert (root.parentNode);

        return '/file-upload/?' + Ext.Object.toQueryString({
            root_uuid: assert (root.get ('uuid')), vcs: vcs
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
