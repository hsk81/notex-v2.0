Ext.define ('Webed.view.ContentTabs', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.content-tabs',

    requires: [
        'Webed.form.field.CodeArea',
        'Ext.layout.container.Absolute'
    ],

    html: Ext.fly ('content').getHTML ()
});
