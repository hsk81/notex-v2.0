Ext.define ('Webed.controller.window.AddFileBox', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'add-file-box', ref: 'addFileBox'
    }],

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
        var box = assert (this.getAddFileBox ());
        var record = assert (box.getRecord ());
        if (record.isLeaf ()) {
            record = assert (record.parentNode);
        }

        var store = assert (combobox.getStore ());
        var mime = assert (record.get ('mime'));
        var MIME = assert (store.query ('mime', mime).getAt (0));

        var main = MIME.get ('main');
        if (main) {
            combobox.setValue (main);

            var form = assert (combobox.up ('form'));
            var textfield = assert (form.down ('textfield'));
            var MAIN = assert (store.findRecord ('mime', main));
            var exts = assert (MAIN.get ('exts'));
            var ext = assert (exts.length > 0 && exts[0]);

            textfield.setValue ('file.{0}'.format (ext));
        }
    },

    mime_select: function (combobox) {
        var form = assert (combobox.up ('form'));
        var textfield = assert (form.down ('textfield'));
        textfield.validate (); if (!textfield.isValid ()) {
            textfield.focus (true, 25);
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var box = assert (this.getAddFileBox ());
        var textfield = assert (box.down ('textfield[name=name]'));
        var combobox = assert (box.down ('combobox[name=mime]'));
        var checkbox = assert (box.down ('checkbox[name=vcs]'));

        if (!textfield.isValid ()) return;
        var name = assert (textfield.getValue ());
        if (!combobox.isValid ()) return;
        var mime = assert (combobox.getValue ());

        var record = assert (box.getRecord ());
        if (record.isLeaf ()) {
            record = assert (record.parentNode);
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
                        name: 'data',
                        node_uuid: leaf.get ('uuid'),
                        size: 5,
                        type: (checkbox.getValue ())
                            ? 'TextVcsProperty'
                            : 'TextCowProperty'
                    }]
                });
            } else {
                console.error ('[AddFileBox.confirm]', leaf, op);
            }
        }

        application.fireEvent ('create_leaf', {
            scope: this, callback: callback, where: {
                mime: mime,
                name: name,
                root: record,
                size: 5
            }
        });

        box.close ();
    },

    cancel: function () {
        assert (this.getAddFileBox ()).close ();
    }
});
