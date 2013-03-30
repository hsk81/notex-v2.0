Ext.define ('Webed.controller.RenameBox', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'rename-box', ref: 'renameBox'
    }],

    init: function () {
        this.control ({
            'rename-box button[action=confirm]': {
                click: this.confirm
            },
            'rename-box button[action=cancel]': {
                click: this.cancel
            },
            'rename-box textfield': {
                afterrender: this.afterrender,
                keypress: this.keypress,
                keydown: this.keydown,
                focus: this.focus,
                blur: this.blur
            },
            'rename-box': {
                show: this.show
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

    focus: function (textfield) {
        textfield.autofocus = true;
    },

    blur: function (textfield) {
        if (textfield.autofocus) textfield.focus (true, 25);
    },

    afterrender: function (textfield) {
        textfield.focus (true, 25);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    show: function () {
        var box = assert (this.getRenameBox ());
        var record = assert (box.getRecord ());
        var textfield = assert (box.down ('textfield'));

        var fullname = assert (record.get ('name'));
        var array = assert (fullname.split ('.'));
        assert (array.pop ()); // extension

        textfield.setValue (array.join ('.'));
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var box = assert (this.getRenameBox ());
        var textfield = assert (box.down ('textfield'));
        var record = assert (box.getRecord ());

        if (!textfield.isValid ()) {
            return;
        }

        function callback (record, op) {
            if (record && op && op.success) {
                application.fireEvent ('rename_tab', this, {record: record});
                application.fireEvent ('reload_leaf', this, {record: record});
            } else {
                console.error ('[RenameBox.confirm]', record, op);
            }
        }

        var value = assert (textfield.getValue ());

        var name = assert (record.get ('name'));
        var array = assert (name.split ('.'));
        var ext = assert (array.pop ());
        var name_new = value + '.' + ext;

        var name_path = assert (record.get ('name_path'));
        var name_path_new = name_path.slice (0,-1);
        name_path_new.push (name_new);

        application.fireEvent ('update_node', {
            scope: this, callback: callback, node: record, to: {
                name: name_new, name_path: name_path_new
            }
        });

        box.close ();
    },

    cancel: function () {
        assert (this.getRenameBox ()).close ();
    }
});
