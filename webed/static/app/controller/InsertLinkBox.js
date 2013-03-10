Ext.define ('Webed.controller.InsertLinkBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'insert-link-box', ref: 'insertLinkBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'insert-link-box textfield[name=url]': {
                afterrender: this.link_afterrender,
                blur: this.link_blur
            },
            'insert-link-box textfield[name=label]': {
                afterrender: this.label_afterrender
            },
            'insert-link-box button[action=confirm]': {
                click: this.confirm
            },
            'insert-link-box button[action=cancel]': {
                click: this.cancel
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    link_afterrender: function (textfield) {
        textfield.autofocus = true;
        textfield.focus (true, 25);
    },

    link_blur: function (textfield) {
        if (textfield.autofocus) {
            textfield.focus (true, 25);
            textfield.autofocus = false;
        }
    },

    label_afterrender: function (textfield) {
        var view = assert (this.getInsertLinkBox ());
        var editor = assert (view.editor);
        var label = editor.getSelection ();
        if (label) textfield.setValue (label);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var view = assert (this.getInsertLinkBox ());
        var editor = assert (view.editor);

        var url_textfield = assert (view.down ('textfield[name=url]'));
        var url = assert (url_textfield.getValue ());
        var label_textfield = assert (view.down ('textfield[name=label]'));
        var label = label_textfield.getValue ();

        var link = (label) ? String.format ('`{0} <{1}>`_', label, url) : url;
        editor.replaceSelection (link);
        view.destroy ();
    },

    cancel: function () {
        assert (this.getInsertLinkBox ()).destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
