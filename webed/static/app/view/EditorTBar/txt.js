Ext.define ('Webed.view.EditorTBar.txt', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.editor-tbar-txt',

    items: [{
        action: 'undo',
        defaults: {text: 'Undo'},
        iconCls: 'icon-arrow_undo-16',
        tooltip: 'Undo&nbsp;<div class="w-shortcut">[CTRL+Z]</div>'
    },{
        action: 'redo',
        defaults: {text: 'Redo'},
        iconCls: 'icon-arrow_redo-16',
        tooltip: 'Redo&nbsp;<div class="w-shortcut">[SHIFT+CTRL+Z]</div>'
    },'-',{
        action: 'cut',
        defaults: {text: 'Cut'},
        iconCls: 'icon-cut-16',
        tooltip: 'Cut&nbsp;<div class="w-shortcut">[CTRL+X]</div>'
    },{
        action: 'copy',
        defaults: {text: 'Copy'},
        iconCls: 'icon-page_white_copy-16',
        tooltip: 'Copy&nbsp;<div class="w-shortcut">[CTRL+C]</div>'
    },{
        action: 'paste',
        defaults: {text: 'Paste'},
        iconCls: 'icon-paste_plain-16',
        tooltip: 'Paste&nbsp;<div class="w-shortcut">[CTRL+V]</div>'
    },'-',{
        action: 'find-previous',
        iconCls: 'icon-document_page_previous-16',
        defaults: {text: 'Find Previous'},
        tooltip: 'Find Previous&nbsp;<div class="w-shortcut">[SHIFT+CTRL+G]</div>'
    },{
        action: 'find',
        iconCls: 'icon-find-16',
        defaults: {text: 'Find'},
        tooltip: 'Find&nbsp;<div class="w-shortcut">[CTRL+F]</div>'
    },{
        action: 'clear-search',
        iconCls: 'icon-stop-16',
        defaults: {text: 'Clear Search'},
        tooltip: 'Clear Search'
    },{
        action: 'find-next',
        iconCls: 'icon-document_page_next-16',
        defaults: {text: 'Find Next'},
        tooltip: 'Find Next&nbsp;<div class="w-shortcut">[CTRL+G]</div>'
    },'-',{
        action: 'replace-all',
        iconCls: 'icon-text_replace-16',
        defaults: {text: 'Replace All'},
        tooltip: 'Replace All&nbsp;<div class="w-shortcut">[SHIFT+CTRL+R]</div>'
    }]
});
