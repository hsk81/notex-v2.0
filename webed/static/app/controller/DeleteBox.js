Ext.define ('Webed.controller.DeleteBox', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'delete-box', ref: 'deleteBox'
    }],

    init: function () {
        this.control ({
            'delete-box button[action=confirm]': {click: this.confirm},
            'delete-box button[action=cancel]': {click: this.cancel},
            'delete-box': {show: this.show}
        });
    },

    show: function () {
        var box = assert (this.getDeleteBox ());
        var record = assert (box.getRecord ());
        var name_path = assert (record.get ('name_path'));
        var value = assert (name_path.slice (1).join ('/'));
        var textfield = assert (box.down ('textfield'));

        textfield.setValue (value);
    },

    confirm: function () {
        var application = assert (this.application);
        var box = assert (this.getDeleteBox ());
        var record = assert (box.getRecord ());

        function callback (record, op) {
            if (record && op && op.success) {
                application.fireEvent ('delete_tab', this, {record: record});
                application.fireEvent ('reload_leaf', this, {record: record});
            } else {
                console.error ('[DeleteBox.confirm]', record, op);
            }
        }

        application.fireEvent ('delete_node', {
            scope: this, callback: callback, for: record
        });

        box.close ();
    },

    cancel: function () {
        assert (this.getDeleteBox ()).close ();
    }
});
