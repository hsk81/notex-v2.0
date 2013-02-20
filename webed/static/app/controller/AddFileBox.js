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
            'add-file-box textfield[name=name]': {
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
        var view = this.getAddFileBox ();
        assert (view);

        var textfield = view.down ('textfield[name=name]');
        assert (textfield);
        var combobox = view.down ('combobox[name=mime]');
        assert (combobox);

        if (!textfield.isValid ()) return;
        var name = textfield.getValue ();
        assert (name);

        if (!combobox.isValid ()) return;
        var mime = combobox.getValue ();
        assert (mime);

        var node = view.node;
        assert (node);

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
                        data: '....\n',
                        mime: mime,
                        node_uuid: leaf.get ('uuid'),
                        name: 'data',
                        size: 5,
                        type: 'TextProperty'
                    }]
                });
            } else {
                console.error ('[AddFileBox.confirm]', leaf, op);
            }
        }

        application.fireEvent ('create_leaf', {
            scope: this, callback: callback, with: {
                mime: mime,
                name: name,
                root: node,
                size: 5
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
