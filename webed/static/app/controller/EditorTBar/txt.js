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

    editor: function (component) {
        var panel = assert (component.up ('panel'));
        var ca = assert (panel.down ('code-area'));
        return ca.codemirror;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    cutToBuffer: function (editor, buffer, name) {

        var selection = editor.getSelection ();
        if (selection) {
            buffer[name] = selection;
            editor.replaceSelection ('');
            return true;
        }

        return false;
    },

    copyToBuffer: function (editor, buffer, name) {

        var selection = editor.getSelection ();
        if (selection) {
            buffer[name] = selection;
            return true;
        }

        return false;
    },

    pasteFromBuffer: function (editor, buffer, name) {

        if (buffer[name]) {
            editor.replaceSelection (buffer[name]);
            editor.setCursor (editor.getCursor ());
            return true;
        }

        return false;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    undo: function (button) {
        assert (this.editor (button)).undo ();
    },

    redo: function (button) {
        assert (this.editor (button)).redo ();
    },

    cut: function (button) {
        var editor = assert (this.editor (button));
        if (this.cutToBuffer (editor, document, 'clipboard')) {
            editor.focus ();
        }
    },

    copy: function (button) {
        var editor = assert (this.editor (button));
        if (this.copyToBuffer (editor, document, 'clipboard')) {
            editor.focus ();
        }
    },

    paste: function (button) {
        var editor = assert (this.editor (button));
        if (this.pasteFromBuffer (editor, document, 'clipboard')) {
            editor.focus ();
        }
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
