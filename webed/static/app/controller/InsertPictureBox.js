Ext.define ('Webed.controller.InsertPictureBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'insert-picture-box', ref: 'insertPictureBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'insert-picture-box combobox[name=path]': {
                afterrender: this.afterrender
            },
            'insert-picture-box button[action=confirm]': {
                click: this.confirm
            },
            'insert-picture-box button[action=cancel]': {
                click: this.cancel
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    afterrender: function (combobox) {
        assert (Ext.getStore ('Leafs')).load ({
            scope: this, callback: function (records, operation, success) {
                if (!success) return;

                var paths = records.filter (function (record) {
                    var mime = assert (record.get ('mime'));
                    return MIME.is_image (mime);
                }).map (function (record) {
                    var path = assert (record.get ('name_path'));
                    return [path.slice (1).join ('/')];
                });

                combobox.store.loadData (paths);
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var view = assert (this.getInsertPictureBox ());
        var callback = assert (view.callback);
        var scope = assert (view.scope);

        var path_combo = assert (view.down ('combobox[name=path]'));
        if (!path_combo.isValid ()) return;
        var path = assert (path_combo.getValue ());
        var scale_textfield = assert (view.down ('textfield[name=scale]'));
        if (!scale_textfield.isValid ()) return;
        var scale = assert (scale_textfield.getValue ());
        var alignment_combo = assert (view.down ('combobox[name=alignment]'));
        if (!alignment_combo.isValid ()) return;
        var alignment = assert (alignment_combo.getValue ());
        var caption_textfield = assert (view.down ('textfield[name=caption]'));
        if (!caption_textfield.isValid ()) return;
        var caption = caption_textfield.getValue ();

        callback.call (scope, path, scale, alignment, caption);
        view.destroy ();
    },

    cancel: function () {
        assert (this.getInsertPictureBox ()).destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
