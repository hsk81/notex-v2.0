Ext.define ('Webed.controller.RenameBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'rename-box', ref: 'renameBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'rename-box button[action=confirm]': {click: this.confirm},
            'rename-box button[action=cancel]': {click: this.cancel},
            'rename-box textfield': {keypress: this.keypress},
            'rename-box': {
                afterrender: this.afterrender,
                show: this.show
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    keypress: function (textfield, event) {
        if (event.getCharCode() == Ext.EventObject.ENTER) {
            this.confirm ();
        }
    },

    afterrender: function () {
        var view = this.getRenameBox ();
        assert (view);
        var textfield = view.down ('textfield');
        assert (textfield);

        textfield.focus (true, 250);
    },

    show: function () {
        var view = this.getRenameBox ();
        assert (view);
        var node = view.node;
        assert (node);
        var name = node.get ('name');
        assert (name);
        var textfield = view.down ('textfield');
        assert (textfield);

        textfield.setValue (name);
    },

    confirm: function () {
        var application = this.application;
        assert (application);
        var view = this.getRenameBox ();
        assert (view);
        var textfield = view.down ('textfield');
        assert (textfield);
        var node = view.node;
        assert (node);

        function callback (rec, op) {
            if (rec && op && op.success) {
                application.fireEvent ('rename_tab', this, {
                    record: rec
                });
                application.fireEvent ('reload_leaf', this, {
                    record: rec
                });
            } else {
                console.error ('[RenameBox.confirm]', rec, op);
            }
        }

        application.fireEvent ('update_node', {
            scope: this, callback: callback, for: node, to: {
                name: textfield.getValue ()
            }
        });

        view.destroy ();
    },

    cancel: function () {
        var view = this.getRenameBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
