Ext.define ('Webed.view.EditorTBar.txt', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.editor-tbar-txt',

    items: [{
        action: 'undo',
        defaults: {text: 'Undo'},
        iconCls: 'icon-arrow_undo-16',
        tooltip: 'Undo'
    },{
        action: 'redo',
        defaults: {text: 'Redo'},
        iconCls: 'icon-arrow_redo-16',
        tooltip: 'Redo'
    },'-',{
        action: 'cut',
        defaults: {text: 'Cut'},
        iconCls: 'icon-cut-16',
        tooltip: 'Cut Text'
    },{
        action: 'copy',
        defaults: {text: 'Copy'},
        iconCls: 'icon-page_white_copy-16',
        tooltip: 'Copy'
    },{
        action: 'paste',
        defaults: {text: 'Paste'},
        iconCls: 'icon-paste_plain-16',
        tooltip: 'Paste'
    },'-',{
        action: 'find',
        iconCls: 'icon-find-16',
        defaults: {text: 'Find'},
        tooltip: 'Find'
    },{
        action: 'find-next',
        iconCls: 'icon-document_page_next-16',
        defaults: {text: 'Find Next'},
        tooltip: 'Find Next'
    },{
        action: 'find-previous',
        iconCls: 'icon-document_page_previous-16',
        defaults: {text: 'Find Previous'},
        tooltip: 'Find Previous'
    },{
        action: 'replace-all',
        iconCls: 'icon-text_replace-16',
        defaults: {text: 'Replace All'},
        tooltip: 'Replace All'
    }]
});
