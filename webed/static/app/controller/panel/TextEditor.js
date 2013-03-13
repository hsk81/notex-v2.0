Ext.define ('Webed.controller.panel.TextEditor', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'text-editor', ref: 'textEditor'
    }],

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

    //
    // TODO: Decouple by shifting to `tab-manager`!?
    //

    beforeclose: function (self) {
        var tab_manager = assert (self.up ('tab-manager'));
        if (tab_manager.items.getCount () == 1) {

            var curr = tab_manager;
            var next = curr.up ('panel');

            while (next && next.query ('tab-manager').length == 1) {
                curr = next; next = next.up ('panel');
            }

            var tab_managers = Ext.ComponentQuery.query ('tab-manager');
            if (tab_managers.length > 1) { curr.close (); return false; }
        }

        return true;
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
