Ext.define ('Webed.controller.ArchiveUploadBox', {
    extend: 'Webed.controller.UploadBox',

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
        var view = this.getUploadBox ();
        assert (view);
        var combobox = view.down ('combobox[name=mime]');
        assert (combobox);
        var mime = combobox.getValue ();

        if (mime) return Ext.String.format ('/archive-upload/?mime={0}',
            encodeURIComponent (mime)
        );

        return Ext.String.format ('/archive-upload/');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
