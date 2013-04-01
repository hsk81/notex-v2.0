Ext.define ('Webed.toolbar.MarkdownToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.md-toolbar',

    requires: [
        'Webed.window.InsertLinkBox',
        'Webed.window.InsertPictureBox'
    ],

    items: [{
        action: 'undo',
        overflowText: 'Undo',
        iconCls: 'icon-arrow_undo-16',
        tooltip: 'Undo&nbsp;<div class="w-shortcut">[CTRL+Z]</div>'
    },{
        action: 'redo',
        overflowText: 'Redo',
        iconCls: 'icon-arrow_redo-16',
        tooltip: 'Redo&nbsp;<div class="w-shortcut">[SHIFT+CTRL+Z]</div>'
    },'-',{
        action: 'cut',
        overflowText: 'Cut',
        iconCls: 'icon-cut-16',
        tooltip: 'Cut&nbsp;<div class="w-shortcut">[CTRL+X]</div>'
    },{
        action: 'copy',
        overflowText: 'Copy',
        iconCls: 'icon-page_white_copy-16',
        tooltip: 'Copy&nbsp;<div class="w-shortcut">[CTRL+C]</div>'
    },{
        action: 'paste',
        overflowText: 'Paste',
        iconCls: 'icon-paste_plain-16',
        tooltip: 'Paste&nbsp;<div class="w-shortcut">[CTRL+V]</div>'
    }, '-', {
        action: 'apply-heading-0',
        iconCls: 'icon-text_heading_1-16',
        split: true,
        text: 'Heading',
        tooltip: 'Document Headers',

        menu: {
            items: [{
                action: 'apply-heading-1',
                iconCls: 'icon-text_heading_1-16',
                text: 'First Level'
            },{
                action: 'apply-heading-2',
                iconCls: 'icon-text_heading_2-16',
                text: 'Second Level'
            }]
        }
    },'-',{
        action: 'toggle-strong',
        iconCls: 'icon-text_bold-16',
        overflowText: 'Strong Emphasis',
        tooltip: 'Strong Emphasis&nbsp;<div class="w-shortcut">[CTRL+B]</div>'
    },{
        action: 'toggle-italic',
        iconCls: 'icon-text_italic-16',
        overflowText: 'Emphasis',
        tooltip: 'Emphasis&nbsp;<div class="w-shortcut">[CTRL+I]</div>'
    },'-',{
        action: 'lower-case',
        iconCls: 'icon-text_lowercase-16',
        overflowText: 'Lower Case',
        tooltip: 'Lower Case'
    },{
        action: 'upper-case',
        iconCls: 'icon-text_uppercase-16',
        overflowText: 'Upper Case',
        tooltip: 'Upper Case'
    },'-',{
        action: 'decrease-indent',
        iconCls: 'icon-text_indent_remove-16',
        overflowText: 'Decrease Indent',
        tooltip: 'Decrease Indent'
    },{
        action: 'increase-indent',
        iconCls: 'icon-text_indent-16',
        overflowText: 'Increase Indent-16',
        tooltip: 'Increase Indent'
    },'-',{
        action: 'toggle-bullet-list',
        iconCls: 'icon-text_list_bullets-16',
        overflowText: 'Bullet List',
        tooltip: 'Bullet List'
    },{
        action: 'toggle-number-list',
        iconCls: 'icon-text_list_numbers-16',
        overflowText: 'Number List',
        tooltip: 'Number List'
    },'-',{
        action: 'insert-hyperlink',
        iconCls: 'icon-link-16',
        overflowText: 'Hyperlink',
        tooltip: 'Hyperlink'
    },{
        action: 'insert-horizontal-line',
        iconCls: 'icon-hrule-16',
        overflowText: 'Horizontal Line',
        tooltip: 'Horizontal Line'
    },'-',{
        action: 'split-horizontal',
        iconCls: 'icon-application_tile_horizontal-16',
        overflowText: 'Horizontal Split',
        tooltip: 'Horizontal Split'
    },{
        action: 'split-vertical',
        iconCls: 'icon-application_tile_vertical-16',
        overflowText: 'Vertical Split',
        tooltip: 'Vertical Split'
    },'-',{
        action: 'find-previous',
        iconCls: 'icon-document_page_previous-16',
        overflowText: 'Find Previous',
        tooltip: 'Find Previous&nbsp;<div class="w-shortcut">[SHIFT+CTRL+G]</div>'
    },{
        action: 'find',
        iconCls: 'icon-find-16',
        overflowText: 'Find',
        tooltip: 'Find&nbsp;<div class="w-shortcut">[CTRL+F]</div>'
    },{
        action: 'clear-search',
        iconCls: 'icon-stop-16',
        overflowText: 'Clear Search',
        tooltip: 'Clear Search'
    },{
        action: 'find-next',
        iconCls: 'icon-document_page_next-16',
        overflowText: 'Find Next',
        tooltip: 'Find Next&nbsp;<div class="w-shortcut">[CTRL+G]</div>'
    },'-',{
        action: 'replace-all',
        iconCls: 'icon-text_replace-16',
        overflowText: 'Replace All',
        tooltip: 'Replace All&nbsp;<div class="w-shortcut">[SHIFT+CTRL+R]</div>'
    }],

    enableOverflow: true
});
