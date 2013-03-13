Ext.define ('Webed.controller.panel.TextEditor', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'text-editor', ref: 'textEditor'
    }],

    init: function () {
        this.control ({
            'text-editor' : {
                afterlayout: this.afterlayout,
                activate: this.activate
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
