Ext.define ('Webed.controller.window.ArchiveUploadBox', {
    extend: 'Webed.controller.window.UploadBox',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'archive-upload-box', ref: 'uploadBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'archive-upload-box button[action=confirm]': {
                click: this.confirm
            },
            'archive-upload-box button[action=cancel]': {
                click: this.cancel
            },
            'archive-upload-box form filefield': {
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
        var combobox = assert (view.down ('combobox[name=mime]'));
        var mime = assert (combobox.getValue ());

        return '/archive-upload/?' + Ext.Object.toQueryString ({
            mime: mime, vcs: vcs
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
