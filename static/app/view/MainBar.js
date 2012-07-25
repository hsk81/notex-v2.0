Ext.define ('Webed.view.MainBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.main-bar',

    items: [{

        xtype: 'buttongroup',
        title: 'Document',
        columns: 2,
        items: [{
            text : 'Save',
            iconCls : 'icon-disk',
            iconAlign: 'left',
            tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)',
            handler : function (button, event) {}
        },{
            text : 'Open',
            iconCls : 'icon-folder_page',
            iconAlign: 'left',
            tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)',
            handler : function (button, event) {}
        }]

    },{

        xtype: 'buttongroup',
        title: 'Manage',
        columns: 3,
        items: [{
            text : 'Add',
            iconCls : 'icon-add',
            xtype :'splitbutton',
            tooltip : '<b>Add</b><br/>Add a new project, folder or file',
            menu : {
                xtype : 'menu',
                plain : true,

                items : [{
                    iconCls : 'icon-report',
                    text : 'Project',
                    handler : function (button, event) {}
                },{
                    iconCls : 'icon-folder',
                    text : 'Folder',
                    handler : function (button, event) {}
                },{
                    iconCls : 'icon-page',
                    text : 'Plain Text',
                    handler : function (button, event) {}
                }]
            }
        },{
            text : 'Rename',
            iconCls : 'icon-pencil',
            iconAlign: 'left',
            tooltip : '<b>Rename</b><br/>Rename selected project, folder or file',
            handler : function (button, event) {}
        },{
            text : 'Delete',
            iconCls : 'icon-delete',
            iconAlign: 'left',
            tooltip : '<b>Delete</b><br/>Delete selected project, folder or file',
            handler : function (button, event) {}
        }]

    },{

        xtype: 'buttongroup',
        title: 'Projects',
        columns: 2,
        items: [{
            text: 'Import',
            iconCls: 'icon-page_white_zip',
            iconAlign: 'left',
            tooltip : '<b>Import</b><br/>Open a project from a <b>ZIP</b> archive (at <i>local</i> storage)',
            handler : function (button, event) {}
        },{
            id : 'btn.export.editor.id',
            text: 'Export',
            iconCls: 'icon-report_go',
            iconAlign: 'left',
            tooltip : '<b>Export</b><br/>Save selected project (to <i>local</i> storage)',
            handler : function (button, event) {}
        }]

    }]
});
