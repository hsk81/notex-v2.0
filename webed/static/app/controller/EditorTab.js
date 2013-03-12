Ext.define ('Webed.controller.EditorTab', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'editor-tab', ref: 'editorTab'
    }],

    init: function () {
        this.control ({
            'editor-tab' : {
                afterlayout: this.afterlayout,
                activate: this.activate,
                beforeclose: this.beforeclose
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
        console.debug ('[before-close]', self);
    }
});
