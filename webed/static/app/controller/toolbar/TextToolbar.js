Ext.define ('Webed.controller.toolbar.TextToolbar', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'text-toolbar', ref: 'toolbar'
    }],

    stores: ['MIMEs'],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'text-toolbar button[action=undo]': {
                click: this.undo
            },
            'text-toolbar button[action=redo]': {
                click: this.redo
            },
            'text-toolbar button[action=cut]': {
                click: this.cut
            },
            'text-toolbar button[action=copy]': {
                click: this.copy
            },
            'text-toolbar button[action=paste]': {
                click: this.paste
            },

            'text-toolbar button[action=lower-case]': {
                click: this.lower_case
            },
            'text-toolbar button[action=upper-case]': {
                click: this.upper_case
            },

            'text-toolbar button[action=decrease-indent]': {
                click: this.decrease_indent
            },
            'text-toolbar button[action=increase-indent]': {
                click: this.increase_indent
            },

            'text-toolbar button[action=split-vertical]': {
                click: this.split_vertical
            },
            'text-toolbar button[action=split-horizontal]': {
                click: this.split_horizontal
            },

            'text-toolbar button[action=find]': {
                click: this.find
            },
            'text-toolbar button[action=find-next]': {
                click: this.find_next
            },
            'text-toolbar button[action=find-previous]': {
                click: this.find_previous
            },
            'text-toolbar button[action=replace-all]': {
                click: this.replace_all
            },
            'text-toolbar button[action=clear-search]': {
                click: this.clear_search
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_editor: function (component) {
        if (component) {
            return this.editor = assert (this.codemirror (component));
        } else {
            return this.editor;
        }
    },

    codemirror: function (component) {
        return assert (this.code_area (component)).codemirror;
    },

    code_area: function (component) {
        return assert (component.up ('text-editor')).down ('code-area');
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    undo: function (button) {
        var editor = assert (this.get_editor (button));
        editor.undo (); editor.focus ();
    },

    redo: function (button) {
        var editor = assert (this.get_editor (button));
        editor.redo (); editor.focus ();
    },

    cut: function (button) {
        var editor = assert (this.get_editor (button));
        this.cutToBuffer (editor, document, 'clipboard');
        editor.focus ();
    },

    copy: function (button) {
        var editor = assert (this.get_editor (button));
        this.copyToBuffer (editor, document, 'clipboard');
        editor.focus ();
    },

    paste: function (button) {
        var editor = assert (this.get_editor (button));
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
        var editor = assert (this.get_editor (button));
        var selection = editor.getSelection ();
        if (selection) editor.replaceSelection (selection.toLowerCase ());
        editor.focus ();
    },

    upper_case: function (button) {
        var editor = assert (this.get_editor (button));
        var selection = editor.getSelection ();
        if (selection) editor.replaceSelection (selection.toUpperCase ());
        editor.focus ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    decrease_indent: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands ['indentLess'](editor);
        editor.focus ();
    },

    increase_indent: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands ['indentMore'](editor);
        editor.focus ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    split_vertical: function (button) {
        var lhs_tabs = assert (button.up ('tab-manager'));
        var lhs_text_editor = assert (button.up ('text-editor'));
        var lhs_code_area = assert (lhs_text_editor.down ('code-area'));

        var record = assert (lhs_text_editor.record);
        var mime = assert (record.get ('mime'));

        var rhs_code_area = Ext.create ('Webed.form.field.CodeArea', {
            mime: mime
        });
        var rhs_text_editor = Ext.create ('Webed.panel.TextEditor', {
            record: record, codeArea: rhs_code_area
        });

        var rhs_tabs = assert (lhs_tabs.cloneConfig ());
        rhs_tabs.add (rhs_text_editor);
        rhs_tabs.setActiveTab (0);
        var vbox = assert (lhs_tabs.up ('panel[name=vbox]'));

        vbox.add ({
            border: false,
            flex: 1,
            name: 'hbox',
            layout: {type: 'hbox', align: 'stretch'},
            items: [rhs_tabs]
        });

        rhs_code_area.link_to (lhs_code_area);
    },

    split_horizontal: function (button) {
        var lhs_tabs = assert (button.up ('tab-manager'));
        var lhs_text_editor = assert (button.up ('text-editor'));
        var lhs_code_area = assert (lhs_text_editor.down ('code-area'));

        var record = assert (lhs_text_editor.record);
        var mime = assert (record.get ('mime'));

        var rhs_code_area = Ext.create ('Webed.form.field.CodeArea', {
            mime: mime
        });
        var rhs_text_editor = Ext.create ('Webed.panel.TextEditor', {
            record: record, codeArea: rhs_code_area
        });

        var rhs_tabs = assert (lhs_tabs.cloneConfig ());
        rhs_tabs.add (rhs_text_editor);
        rhs_tabs.setActiveTab (0);
        var hbox = assert (lhs_tabs.up ('panel[name=hbox]'));

        hbox.add ({
            border: false,
            flex: 1,
            name: 'vbox',
            layout: {type: 'vbox', align: 'stretch'},
            items: [rhs_tabs]
        });

        rhs_code_area.link_to (lhs_code_area);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    find: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands['find'] (editor);
    },

    find_next: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands['findNext'] (editor);
        editor.focus ();
    },

    find_previous: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands['findPrev'] (editor);
        editor.focus ();
    },

    replace: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands['replace'] (editor);
    },

    replace_all: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands['replaceAll'] (editor);
    },

    clear_search: function (button) {
        var editor = assert (this.get_editor (button));
        CodeMirror.commands['clearSearch'] (editor);
        editor.focus ();
    }
});
