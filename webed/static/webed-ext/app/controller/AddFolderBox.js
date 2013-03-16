Ext.define ('Webed.controller.AddFolderBox', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'add-folder-box', ref: 'addFolderBox'
    }],

    init: function () {
        this.control ({
            'add-folder-box button[action=confirm]': {
                click: this.confirm
            },
            'add-folder-box button[action=cancel]': {
                click: this.cancel
            },
            'add-folder-box textfield': {
                afterrender: this.afterrender,
                keypress: this.keypress,
                keydown: this.keydown,
                focus: this.focus,
                blur: this.blur
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    keydown: function (textfield, event) {
        if (event.getCharCode () == Ext.EventObject.TAB) {
            textfield.autofocus = false;
        }
    },

    keypress: function (textfield, event) {
        if (event.getCharCode () == Ext.EventObject.ENTER) {
            this.confirm ();
        }
    },

    focus: function (textfield, event) {
        textfield.autofocus = true;
    },

    blur: function (textfield, event) {
        if (textfield.autofocus) textfield.focus (true, 25);
    },

    afterrender: function (textfield) {
        textfield.focus (true, 25);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var box = assert (this.getAddFolderBox ());
        var textfield = assert (box.down ('textfield'));
        var record = assert (box.getRecord ());

        if (!textfield.isValid ()) {
            return;
        }

        if (record.isLeaf ()) {
            record = assert (record.parentNode);
        }

        function callback (record, op) {
            if (!record||!op||!op.success) {
                console.error ('[AddFolderBox.confirm]', record, op);
            }
        }

        application.fireEvent ('create_node', {
            scope: this, callback: callback, where: {
                name: textfield.getValue (),
                mime: 'application/folder',
                root: record
            }
        });

        box.close ();
    },

    cancel: function () {
        assert (this.getAddFolderBox ()).close ();
    }
});
