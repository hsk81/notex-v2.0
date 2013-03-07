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
                afterrender: this.name_afterrender,
                blur: this.name_blur
            },
            'add-file-box combobox[name=mime]': {
                afterrender: this.mime_afterrender,
                select: this.mime_select
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    name_afterrender: function (textfield) {
        textfield.autofocus = true;
        textfield.focus (true, 25);
    },

    name_blur: function (textfield) {
        if (textfield.autofocus) {
            textfield.focus (true, 25);
            textfield.autofocus = false;
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    mime_afterrender: function (combobox) {
        var view = assert (this.getAddFileBox ());
        var node = assert (view.node);
        if (node.isLeaf ()) {
            node = assert (node.parentNode);
        }

        var store = assert (combobox.getStore ());
        var mime = assert (node.get ('mime'));
        var MIMEs = assert (store.query ('mime', mime));
        var MIME = assert (MIMEs.getAt (0));

        var main = MIME.get ('main');
        if (main) {
            combobox.setValue (main);

            var record = assert (store.findRecord ('mime', main));
            var ext = assert (record.get ('ext'));
            var form = assert (combobox.up ('form'));
            var textfield = assert (form.down ('textfield'));

            textfield.setValue ('file.{0}'.format (ext));
        }
    },

    mime_select: function (combobox) {
        var form = assert (combobox.up ('form'));
        var textfield = assert (form.down ('textfield'));
        textfield.validate ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var view = assert (this.getAddFileBox ());
        var textfield = assert (view.down ('textfield[name=name]'));
        var combobox = assert (view.down ('combobox[name=mime]'));

        if (!textfield.isValid ()) return;
        var name = assert (textfield.getValue ());
        if (!combobox.isValid ()) return;
        var mime = assert (combobox.getValue ());

        var node = assert (view.node);
        if (node.isLeaf ()) {
            node = assert (node.parentNode);
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
        assert (this.getAddFileBox ()).destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
