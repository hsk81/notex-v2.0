Ext.define ('Webed.view.EditorTBar.txt', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.editor-tbar-txt',

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
