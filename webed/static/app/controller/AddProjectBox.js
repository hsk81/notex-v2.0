Ext.define ('Webed.controller.AddProjectBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'add-project-box', ref: 'addProjectBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'add-project-box button[action=confirm]': {
                click: this.confirm
            },
            'add-project-box button[action=cancel]': {
                click: this.cancel
            },
            'add-project-box textfield[name=name]': {
                afterrender: this.afterrender,
                blur: this.blur
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    blur: function (textfield, event) {
        if (textfield.autofocus) {
            textfield.focus (true, 25);
            textfield.autofocus = false;
        }
    },

    afterrender: function (textfield) {
        textfield.autofocus = true;
        textfield.focus (true, 25);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = this.application;
        assert (application);
        var view = this.getAddProjectBox ();
        assert (view);
        var node = view.node;
        assert (node);

        var textfield = view.down ('textfield[name=name]');
        assert (textfield);
        var combobox = view.down ('combobox[name=mime]');
        assert (combobox);

        if (!textfield.isValid ()) return;
        if (!combobox.isValid ()) return;

        function callback (rec, op) {
            if (!rec||!op||!op.success) {
                console.error ('[AddProjectBox.confirm]', rec, op);
            }
        }

        this.application.fireEvent ('create_node', {
            scope: this, callback: callback, with: {
                mime: combobox.getValue (),
                name: textfield.getValue (),
                root: node
            }
        });

        view.destroy ();
    },

    cancel: function () {
        var view = this.getAddProjectBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
