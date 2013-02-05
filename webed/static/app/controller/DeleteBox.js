Ext.define ('Webed.controller.DeleteBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'delete-box', ref: 'deleteBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'delete-box button[action=confirm]': {click: this.confirm},
            'delete-box button[action=cancel]': {click: this.cancel},
            'delete-box': {show: this.show}
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    show: function (box) {
        var view = this.getDeleteBox ();
        assert (view);
        var node = view.node;
        assert (node);
        var name_path = node.get ('name_path');
        assert (name_path);
        var path = name_path.slice (1).join ('/');
        assert (path);
        var textfield = box.down ('textfield');
        assert (textfield); textfield.setValue (path);
    },

    confirm: function () {
        var application = this.application;
        assert (application);
        var view = this.getDeleteBox ();
        assert (view);
        var node = view.node;
        assert (node);

        function callback (rec, op) {
            if (rec && op && op.success) {
                application.fireEvent ('delete_tab', this, {
                    record: rec
                });
                application.fireEvent ('reload_leaf', this, {
                    record: rec
                });
            } else {
                console.error ('[DeleteBox.confirm]', rec, op);
            }
        }

        application.fireEvent ('delete_node', {
            scope: this, callback: callback, for: node
        });

        view.destroy ();
    },

    cancel: function () {
        var view = this.getDeleteBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
