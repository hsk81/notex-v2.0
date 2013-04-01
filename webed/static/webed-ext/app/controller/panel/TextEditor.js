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
                focus: this.focus,
                blur: this.blur
            }
        });
    },

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

            var confirmBox = Ext.create ('Webed.windows.ConfirmBox', {
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

    focus: function (code_area) {
        var editors = Ext.ComponentQuery.query ('text-editor');
        editors.every (function (editor) {
            var ca = assert (editor.down ('code-area'));
            if (ca == code_area) {
                editor.bubble (function (component) {
                    component.fireEvent ('focus', component);
                }); return false;
            } return true;
        });
    },

    blur: function (code_area) {
        var editors = Ext.ComponentQuery.query ('text-editor');
        editors.every (function (editor) {
            var ca = assert (editor.down ('code-area'));
            if (ca == code_area) {
                editor.bubble (function (component) {
                    component.fireEvent ('blur', component);
                }); return false;
            } return true;
        });
    }
});
