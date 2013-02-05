Ext.define ('Webed.view.MainBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.main-bar',

    requires: [
        'Ext.button.Split',
        'Ext.container.ButtonGroup',
        'Webed.view.UploadBox',
        'Webed.view.DeleteBox'
    ],

    items: [{

        xtype: 'buttongroup',
        title: 'Document',
        columns: 2,
        items: [{
            text : 'Save',
            iconCls : 'icon-disk-16',
            iconAlign: 'left',
            tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)',
            action: 'save-document'
        },{
            text : 'Open',
            iconCls : 'icon-folder_page-16',
            iconAlign: 'left',
            tooltip : '<b>Open</b><br/>Open a file (from <i>local</i> storage)',
            action: 'open-document'
        }]

    },{

        xtype: 'buttongroup',
        title: 'Manage',
        columns: 3,
        items: [{
            text : 'Add',
            iconCls : 'icon-add-16',
            xtype :'splitbutton',
            tooltip : '<b>Add</b><br/>Add a new project, folder or file',
            action: 'add',
            menu : {
                xtype : 'menu',
                plain : true,

                items : [{
                    iconCls : 'icon-report-16',
                    text : 'Project',
                    action: 'add-project'
                },{
                    iconCls : 'icon-folder-16',
                    text : 'Folder',
                    action: 'add-folder'
                },{
                    iconCls : 'icon-page-16',
                    text : 'Plain Text',
                    action: 'add-text'
                }]
            }
        },{
            text : 'Rename',
            iconCls : 'icon-pencil-16',
            iconAlign: 'left',
            tooltip : '<b>Rename</b><br/>Rename selected project, folder or file',
            action: 'rename'
        },{
            text : 'Delete',
            iconCls : 'icon-delete-16',
            iconAlign: 'left',
            tooltip : '<b>Delete</b><br/>Delete selected project, folder or file',
            action: 'delete'
        }]

    },{

        xtype: 'buttongroup',
        title: 'ZIP Archive',
        columns: 2,
        items: [{
            text: 'Import',
            iconCls: 'icon-page_white_zip-16',
            iconAlign: 'left',
            tooltip : '<b>Import</b><br/>Import a project from a <b>ZIP</b> archive',
            action: 'import-project'
        },{
            text: 'Export',
            iconCls: 'icon-report_go-16',
            iconAlign: 'left',
            tooltip : '<b>Export</b><br/>Export selected project as a <b>ZIP</b> archive',
            action: 'export-project'
        }]

    }]
});
