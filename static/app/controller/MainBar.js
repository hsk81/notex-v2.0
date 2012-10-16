Ext.define ('Webed.controller.MainBar', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.control ({
            'main-bar menuitem[action=save-document]': {
                click: this.saveDocument
            },
            'main-bar menuitem[action=open-document]': {
                click: this.openDocument
            },
            'main-bar menuitem[action=add-project]': {
                click: this.addProject
            },
            'main-bar menuitem[action=add-folder]': {
                click: this.addFolder
            },
            'main-bar menuitem[action=add-text]': {
                click: this.addText
            },
            'main-bar menuitem[action=rename-project-or-document]': {
                click: this.renameProjectOrDocument
            },
            'main-bar menuitem[action=delete-project-or-document]': {
                click: this.deleteProjectOrDocument
            },
            'main-bar menuitem[action=import-project]': {
                click: this.importProject
            },
            'main-bar menuitem[action=export-project]': {
                click: this.exportProject
            }
        });
    },

    saveDocument: function (item, event, options) {},
    openDocument: function (item, event, options) {},
    addProject: function (item, event, options) {},
    addFolder: function (item, event, options) {},
    addText: function (item, event, options) {},
    renameProjectOrDocument: function (item, event, options) {},
    deleteProjectOrDocument: function (item, event, options) {},
    importProject: function (item, event, options) {},
    exportProject: function (item, event, options) {}
});
