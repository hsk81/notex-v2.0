Ext.define ('Webed.controller.window.AnnotateBox', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'annotate-box', ref: 'annotateBox'
    }],

    init: function () {
        this.control ({
            'annotate-box button[action=confirm]': {
                click: this.confirm
            },
            'annotate-box button[action=cancel]': {
                click: this.cancel
            },
            'annotate-box textarea': {
                afterrender: this.afterrender,
                keypress: this.keypress,
                keydown: this.keydown,
                focus: this.focus,
                blur: this.blur
            },
            'annotate-box': {
                show: this.show
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    keydown: function (textarea, event) {
        if (event.getCharCode () == Ext.EventObject.TAB) {
            textarea.autofocus = false;
        }
    },

    keypress: function (textarea, event) {
        if (event.getCharCode () == Ext.EventObject.ENTER) {
            this.confirm ();
        }
    },

    focus: function (textarea) {
        textarea.autofocus = false;
    },

    blur: function (textarea) {
        if (textarea.autofocus) textarea.focus (true, 25);
    },

    afterrender: function (textarea) {
        textarea.focus (true, 25);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    show: function () {
        var box = assert (this.getAnnotateBox ());
        var record = assert (box.getRecord ());
        var textfield = assert (box.down ('textfield'));
        var name = assert (record.get ('name'));

        textfield.setValue ('Update {0}'.format (name));
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var box = assert (this.getAnnotateBox ());
        var textarea = assert (box.down ('textarea'));
        if (textarea.isValid () == false) return;

        var application = assert (this.application);
        application.fireEvent ('progress-play', this, {
            message: 'Saving', label: 'AnnotateBox.confirm'
        });

        function callback (records, op) {
            if (!records||!op||!op.success) {
                console.error ('[AnnotateBox.confirm]', records, op);
            }

            application.fireEvent ('progress-stop', this, {
                label: 'AnnotateBox.confirm'
            });

            box.setLoading (false);
            box.close ();
        }

        var note = textarea.getValue ();
        if (note) {
            application.global.set ('note', textarea.getValue ());
        }

        application.fireEvent ('update_tab', this, {
            scope: this, callback: callback, record: assert (box.getRecord ())
        });

        box.setLoading ();
    },

    cancel: function () {
        assert (this.getAnnotateBox ()).close ();
    }
});
