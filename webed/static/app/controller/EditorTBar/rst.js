Ext.define ('Webed.controller.EditorTBar.rst', {
    extend: 'Webed.controller.EditorTBar.txt',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'editor-tbar-rst button[action=undo]': {
                click: this.undo
            },
            'editor-tbar-rst button[action=redo]': {
                click: this.redo
            },
            'editor-tbar-rst button[action=cut]': {
                click: this.cut
            },
            'editor-tbar-rst button[action=copy]': {
                click: this.copy
            },
            'editor-tbar-rst button[action=paste]': {
                click: this.paste
            },

            'editor-tbar-rst button[action=apply-heading-0]': {
                click: Ext.pass (this.apply_heading, [0])
            },
            'editor-tbar-rst menuitem[action=apply-heading-1]': {
                click: Ext.pass (this.apply_heading, [1])
            },
            'editor-tbar-rst menuitem[action=apply-heading-2]': {
                click: Ext.pass (this.apply_heading, [2])
            },
            'editor-tbar-rst menuitem[action=apply-heading-3]': {
                click: Ext.pass (this.apply_heading, [3])
            },
            'editor-tbar-rst menuitem[action=apply-heading-4]': {
                click: Ext.pass (this.apply_heading, [4])
            },
            'editor-tbar-rst menuitem[action=apply-heading-5]': {
                click: Ext.pass (this.apply_heading, [5])
            },
            'editor-tbar-rst menuitem[action=apply-heading-6]': {
                click: Ext.pass (this.apply_heading, [6])
            },

            'editor-tbar-rst button[action=toggle-strong]': {
                click: this.toggle_strong
            },
            'editor-tbar-rst button[action=toggle-italic]': {
                click: this.toggle_italic
            },
            'editor-tbar-rst button[action=toggle-literal]': {
                click: this.toggle_literal
            },

            'editor-tbar-rst button[action=toggle-subscript]': {
                click: this.toggle_subscript
            },
            'editor-tbar-rst button[action=toggle-supscript]': {
                click: this.toggle_supscript
            },

            'editor-tbar-rst button[action=lower-case]': {
                click: this.lower_case
            },
            'editor-tbar-rst button[action=upper-case]': {
                click: this.upper_case
            },

            'editor-tbar-rst button[action=decrease-indent]': {
                click: this.decrease_indent
            },
            'editor-tbar-rst button[action=increase-indent]': {
                click: this.increase_indent
            },

            'editor-tbar-rst button[action=toggle-bullet-list]': {
                click: this.toggle_bullet_list
            },
            'editor-tbar-rst button[action=toggle-number-list]': {
                click: this.toggle_number_list
            },

            'editor-tbar-rst button[action=insert-figure]': {
                click: this.insert_figure
            },
            'editor-tbar-rst button[action=insert-image]': {
                click: this.insert_image
            },
            'editor-tbar-rst button[action=insert-hyperlink]': {
                click: this.insert_hyperlink
            },
            'editor-tbar-rst button[action=insert-footnote]': {
                click: this.insert_footnote
            },
            'editor-tbar-rst button[action=insert-horizontal-line]': {
                click: this.insert_horizontal_line
            },

            'editor-tbar-rst button[action=find]': {
                click: this.find
            },
            'editor-tbar-rst button[action=find-next]': {
                click: this.find_next
            },
            'editor-tbar-rst button[action=find-previous]': {
                click: this.find_previous
            },
            'editor-tbar-rst button[action=replace-all]': {
                click: this.replace_all
            },
            'editor-tbar-rst button[action=clear-search]': {
                click: this.clear_search
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    apply_heading: function (level, button) {
        console.debug ('[apply-heading]', level, button);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    toggle_strong: function (button) {
        console.debug ('[toggle-strong]', button);
    },

    toggle_italic: function (button) {
        console.debug ('[toggle-italic]', button);
    },

    toggle_literal: function (button) {
        console.debug ('[toggle-literal]', button);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    toggle_subscript: function (button) {
        console.debug ('[toggle-subscript]', button);
    },

    toggle_supscript: function (button) {
        console.debug ('[toggle-supscript]', button);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    toggle_bullet_list: function (button) {
        console.debug ('[toggle-bullet-list]', button);
    },

    toggle_number_list: function (button) {
        console.debug ('[toggle-number-list]', button);
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    insert_figure: function (button) {
        console.debug ('[insert-figure]', button);
    },

    insert_image: function (button) {
        console.debug ('[insert-image]', button);
    },

    insert_hyperlink: function (button) {
        console.debug ('[insert-hyperlink]', button);
    },

    insert_footnote: function (button) {
        console.debug ('[insert-footnote]', button);
    },

    insert_horizontal_line: function (button) {
        console.debug ('[insert-horizontal-line]', button);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
