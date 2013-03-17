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
            'text-toolbar component[action=undo]': {
                click: this.undo
            },
            'text-toolbar component[action=redo]': {
                click: this.redo
            },
            'text-toolbar component[action=cut]': {
                click: this.cut
            },
            'text-toolbar component[action=copy]': {
                click: this.copy
            },
            'text-toolbar component[action=paste]': {
                click: this.paste
            },

            'text-toolbar component[action=lower-case]': {
                click: this.lower_case
            },
            'text-toolbar component[action=upper-case]': {
                click: this.upper_case
            },

            'text-toolbar component[action=decrease-indent]': {
                click: this.decrease_indent
            },
            'text-toolbar component[action=increase-indent]': {
                click: this.increase_indent
            },

            'text-toolbar component[action=split-vertical]': {
                click: this.split_vertical
            },
            'text-toolbar component[action=split-horizontal]': {
                click: this.split_horizontal
            },

            'text-toolbar component[action=find]': {
                click: this.find
            },
            'text-toolbar component[action=find-next]': {
                click: this.find_next
            },
            'text-toolbar component[action=find-previous]': {
                click: this.find_previous
            },
            'text-toolbar component[action=replace-all]': {
                click: this.replace_all
            },
            'text-toolbar component[action=clear-search]': {
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
        this.split (button, 'vbox', 'hbox');
    },

    split_horizontal: function (button) {
        this.split (button, 'hbox', 'vbox');
    },

    split: function (button, type, subtype) {
        var lhs_manager = assert (button.up ('tab-manager'));
        var lhs_editor = assert (button.up ('text-editor'));
        var lhs_area = assert (lhs_editor.down ('code-area'));

        var record = assert (lhs_editor.record);
        var mime = assert (record.get ('mime'));

        var rhs_area = Ext.create ('Webed.form.field.CodeArea', {
            mime: mime, value: lhs_area.getOriginal ()
        });
        var rhs_editor = Ext.create ('Webed.panel.TextEditor', {
            record: record, codeArea: rhs_area
        });

        var rhs_manager = assert (lhs_manager.cloneConfig ());
        rhs_manager.add (rhs_editor);
        rhs_manager.setActiveTab (0);

        var box = assert (lhs_manager.up ('panel[name={0}]'.format (type)));
        box.add ({
            border: false,
            flex: 1,
            name: subtype,
            layout: {type: subtype, align: 'stretch'},
            items: [rhs_manager]
        });

        rhs_area.link_to (lhs_area);
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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
