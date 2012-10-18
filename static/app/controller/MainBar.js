Ext.define ('Webed.controller.MainBar', {
    extend: 'Ext.app.Controller',

    models: ['Set', 'Doc', 'Set2Doc'],
    stores: ['Sets', 'Docs', 'Set2Docs'],

    init: function () {
        this.control ({
            'main-bar button[action=save-document]': {
                click: this.saveDocument
            },
            'main-bar button[action=open-document]': {
                click: this.openDocument
            },
            'main-bar splitbutton[action=add]': {
                click: this.add
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
            'main-bar button[action=rename]': {
                click: this.rename
            },
            'main-bar button[action=delete]': {
                click: this.delete
            },
            'main-bar button[action=import-project]': {
                click: this.importProject
            },
            'main-bar button[action=export-project]': {
                click: this.exportProject
            }
        });
    },

    saveDocument: function (item, event, options) {
        console.debug ('[MainBarCtrl.saveDocument]');
    },
    openDocument: function (item, event, options) {
        console.debug ('[MainBarCtrl.openDocument]');
    },
    add: function (item, event, options) {
        console.debug ('[MainBarCtrl.add]');

        this.application.fireEvent ('create_set', {
            name: 'Thesis'
        });
    },
    addProject: function (item, event, options) {
        console.debug ('[MainBarCtrl.addProject]');
    },
    addFolder: function (item, event, options) {
        console.debug ('[MainBarCtrl.addFolder]');
    },
    addText: function (item, event, options) {
        console.debug ('[MainBarCtrl.addText]');
    },
    rename: function (item, event, options) {
        console.debug ('[MainBarCtrl.rename]');
    },
    delete: function (item, event, options) {
        console.debug ('[MainBarCtrl.delete]');
    },
    importProject: function (item, event, options) {
        console.debug ('[MainBarCtrl.importProject]');
    },
    exportProject: function (item, event, options) {
        console.debug ('[MainBarCtrl.exportProject]');
    }
});
