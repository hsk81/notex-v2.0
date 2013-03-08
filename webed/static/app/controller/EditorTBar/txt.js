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

    codemirror: function (component) {
        return assert (this.codearea (component)).codemirror;
    },

    codearea: function (component) {
        return assert (component.up ('panel')).down ('code-area');
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    undo: function (button) {
        var editor = assert (this.codemirror (button));
        editor.undo (); editor.focus ();
    },

    redo: function (button) {
        var editor = assert (this.codemirror (button));
        editor.redo (); editor.focus ();
    },

    cut: function (button) {
        var editor = assert (this.codemirror (button));
        this.cutToBuffer (editor, document, 'clipboard');
        editor.focus ();
    },

    copy: function (button) {
        var editor = assert (this.codemirror (button));
        this.copyToBuffer (editor, document, 'clipboard');
        editor.focus ();
    },

    paste: function (button) {
        var editor = assert (this.codemirror (button));
        this.pasteFromBuffer (editor, document, 'clipboard');
        editor.focus ();
    },

    ///////////////////////////////////////////////////////////////////////////

    cutToBuffer: function (editor, buffer, name) {
        var selection = editor.getSelection ();
        if (selection) {
            buffer[name] = selection;
            editor.replaceSelection ('');
        }
    },

    copyToBuffer: function (editor, buffer, name) {
        var selection = editor.getSelection ();
        if (selection) {
            buffer[name] = selection;
        }
    },

    pasteFromBuffer: function (editor, buffer, name) {
        if (buffer[name]) {
            editor.replaceSelection (buffer[name]);
            editor.setCursor (editor.getCursor ());
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    lower_case: function (button) {
        var editor = assert (this.codemirror (button));
        var selection = editor.getSelection ();
        if (selection) editor.replaceSelection (selection.toLowerCase ());
        editor.focus ();
    },

    upper_case: function (button) {
        var editor = assert (this.codemirror (button));
        var selection = editor.getSelection ();
        if (selection) editor.replaceSelection (selection.toUpperCase ());
        editor.focus ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    decrease_indent: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands ['indentLess'](editor);
        editor.focus ();
    },

    increase_indent: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands ['indentMore'](editor);
        editor.focus ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    find: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands['find'] (editor);
    },

    find_next: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands['findNext'] (editor);
        editor.focus ();
    },

    find_previous: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands['findPrev'] (editor);
        editor.focus ();
    },

    replace: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands['replace'] (editor);
    },

    replace_all: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands['replaceAll'] (editor);
    },

    clear_search: function (button) {
        var editor = assert (this.codemirror (button));
        CodeMirror.commands['clearSearch'] (editor);
        editor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
