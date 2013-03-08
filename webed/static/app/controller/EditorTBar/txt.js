Ext.define ('Webed.controller.EditorTBar.txt', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'editor-tbar-txt button[action=undo]': {
                click: this.undo
            },
            'editor-tbar-txt button[action=redo]': {
                click: this.redo
            },
            'editor-tbar-txt button[action=cut]': {
                click: this.cut
            },
            'editor-tbar-txt button[action=copy]': {
                click: this.copy
            },
            'editor-tbar-txt button[action=paste]': {
                click: this.paste
            },

            'editor-tbar-txt button[action=find]': {
                click: this.find
            },
            'editor-tbar-txt button[action=find-next]': {
                click: this.find_next
            },
            'editor-tbar-txt button[action=find-previous]': {
                click: this.find_previous
            },
            'editor-tbar-txt button[action=replace-all]': {
                click: this.replace_all
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    undo: function (button) {
        console.debug ('[undo]', button);
    },

    redo: function (button) {
        console.debug ('[redo]', button);
    },

    cut: function (button) {
        console.debug ('[cut]', button);
    },

    copy: function (button) {
        console.debug ('[copy]', button);
    },

    paste: function (button) {
        console.debug ('[paste]', button);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    find: function (button) {
        console.debug ('[find]', button);
    },

    find_next: function (button) {
        console.debug ('[find-next]', button);
    },

    find_previous: function (button) {
        console.debug ('[find-previous]', button);
    },

    replace_all: function (button) {
        console.debug ('[replace-all]', button);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
