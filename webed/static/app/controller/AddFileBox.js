Ext.define ('Webed.controller.AddFileBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'add-file-box', ref: 'addFileBox'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'add-file-box button[action=confirm]': {
                click: this.confirm
            },
            'add-file-box button[action=cancel]': {
                click: this.cancel
            },
            'add-file-box textfield': {
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
        var view = this.getAddFileBox ();
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

        function callback (leaf, op) {
            if (leaf && op && op.success) {
                function on_set (prop, op) {
                    if (!prop||!op||!op.success) {
                        console.error ('[AddFileBox.confirm]', prop, op);
                    }
                }

                application.fireEvent ('set_property', this, {
                    scope: this, callback: on_set, property: [{
                        data: '....',
                        mime: 'text/plain',
                        node_uuid: leaf.get ('uuid'),
                        name: 'data',
                        size: 4,
                        type: 'TextProperty'
                    }]
                });
            } else {
                console.error ('[AddFileBox.confirm]', leaf, op);
            }
        }

        application.fireEvent ('create_leaf', {
            scope: this, callback: callback, with: {
                mime: 'text/plain',
                name: textfield.getValue (),
                root: node,
                size: 4
            }
        });

        view.destroy ();
    },

    cancel: function () {
        var view = this.getAddFileBox ();
        assert (view); view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
