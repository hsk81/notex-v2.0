Ext.define ('Webed.controller.AddFolderBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'add-folder-box', ref: 'addFolderBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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
        var application = this.application;
        assert (application);
        var view = this.getAddFolderBox ();
        assert (view);
        var textfield = view.down ('textfield');
        assert (textfield);
        var node = view.node;
        assert (node);

        if (!textfield.isValid ()) {
            return;
        }

        if (node.isLeaf ()) {
            assert (node.parentNode);
            node = node.parentNode;
        }

        function callback (rec, op) {
            if (!rec||!op||!op.success) {
                console.error ('[AddFolderBox.confirm]', rec, op);
            }
        }

        application.fireEvent ('create_node', {
            scope: this, callback: callback, with: {
                name: textfield.getValue (),
                mime: 'application/folder',
                root: node
            }
        });

        view.destroy ();
    },

    cancel: function () {
        var view = this.getAddFolderBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
