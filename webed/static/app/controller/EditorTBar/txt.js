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

            'editor-tbar-txt button[action=lower-case]': {
                click: this.lower_case
            },
            'editor-tbar-txt button[action=upper-case]': {
                click: this.upper_case
            },

            'editor-tbar-txt button[action=decrease-indent]': {
                click: this.decrease_indent
            },
            'editor-tbar-txt button[action=increase-indent]': {
                click: this.increase_indent
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
            },
            'editor-tbar-txt button[action=clear-search]': {
                click: this.clear_search
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

    lower_case: function (button) {
        var editor = assert (this.editor (button));
        var selection = editor.getSelection ();
        if (selection) editor.replaceSelection (selection.toLowerCase ());
    },

    upper_case: function (button) {
        var editor = assert (this.editor (button));
        var selection = editor.getSelection ();
        if (selection) editor.replaceSelection (selection.toUpperCase ());
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    decrease_indent: function (button) {
        console.debug ('[decrease-indent]', button);
    },

    increase_indent: function (button) {
        console.debug ('[increase-indent]', button);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    find: function (button) {
        CodeMirror.commands['find'] (assert (this.editor (button)));
    },

    find_next: function (button) {
        CodeMirror.commands['findNext'] (assert (this.editor (button)));
    },

    find_previous: function (button) {
        CodeMirror.commands['findPrev'] (assert (this.editor (button)));
    },

    replace: function (button) {
        CodeMirror.commands['replace'] (assert (this.editor (button)));
    },

    replace_all: function (button) {
        CodeMirror.commands['replaceAll'] (assert (this.editor (button)));
    },

    clear_search: function (button) {
        CodeMirror.commands['clearSearch'] (assert (this.editor (button)));
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
