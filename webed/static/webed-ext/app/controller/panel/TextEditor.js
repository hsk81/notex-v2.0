Ext.define ('Webed.controller.panel.TextEditor', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'text-editor', ref: 'textEditor'
    }],

    requires: [
        'Webed.window.ConfirmBox'
    ],

    init: function () {
        this.control ({
            'text-editor' : {
                afterlayout: this.afterlayout,
                activate: this.activate,
                beforeclose: this.beforeclose
            },

            'text-editor code-area': {
                change: this.change,
                clean: this.clean,
                focus: this.focus,
                blur: this.blur
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    afterlayout: function (self) {
        var tbar = assert (self.child ('toolbar'));
        var ca = assert (self.child ('code-area'));

        var height1 = self.getHeight ();
        assert (typeof (height1) == 'number');
        var height2 = tbar.getHeight ();
        assert (typeof (height2) == 'number');

        ca.setHeight (height1 - height2 - 2);
    },

    activate: function (self) {
        assert (self.child ('code-area')).focus (true, 125);
    },

    beforeclose: function (self) {
        var ca = assert (self.child ('code-area'));
        if (!ca.getClean ({fake: true})) {

            var record = assert (self.getRecord ());
            var name_path = assert (record.get ('name_path'));
            var value = assert (name_path.slice (1).join ('/'));
            var title = assert (record.getTitle ());
            var iconCls = assert (record.get ('iconCls'));

            var confirmBox = Ext.create ('Webed.window.ConfirmBox', {
                title: 'Close {0}?'.format (title),
                iconCls: iconCls,
                value: value,

                listeners: {
                    confirm: function (box) {
                        box.close ();
                        ca.setClean ({fake: true});
                        self.close ();
                    },
                    cancel: function (box) {
                        box.close ();
                    }
                }
            });

            confirmBox.show ();
            return false;
        } return true;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    clean: function (code_area, opts) {
        if (opts && opts.fake) return; {
            var editor = assert (this.get_editor (code_area));
            editor.setTitle (editor.default_title);

            function editor_for (doc) {
                var codemirror = assert (doc.getEditor ());
                var editors = Ext.ComponentQuery.query ('text-editor');
                var editor = null;

                editors.every (function (ed) {
                    var ca = assert (ed.down ('code-area'));
                    if (ca.codemirror == codemirror) {
                        editor = ed; return false;
                    } return true;
                });

                return editor;
            }

            code_area.codemirror.iterLinkedDocs (function (doc) {
                var editor = editor_for (doc);
                if (editor) editor.setTitle (editor.default_title);
            });
        }
    },

    change: function (code_area) {
        var editor = assert (this.get_editor (code_area));
        if (editor.default_title == undefined) {
            editor.default_title = editor.title;
        }

        if (editor.default_title == editor.title) {
            editor.setTitle ('<i>{0}</i>'.format (editor.title));
        }
    },

    focus: function (code_area) {
        var editor = assert (this.get_editor (code_area));
        editor.bubble (function (component) {
            component.fireEvent ('focus', component);
        });
    },

    blur: function (code_area) {
        var editor = assert (this.get_editor (code_area));
        editor.bubble (function (component) {
            component.fireEvent ('blur', component);
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_editor: function (code_area) {
        var editors = Ext.ComponentQuery.query ('text-editor');
        var editor = null;

        editors.every (function (ed) {
            var ca = assert (ed.down ('code-area'));
            if (ca == code_area) {
                editor = ed;
                return false;
            } return true;
        });

        return editor;
    }
});
