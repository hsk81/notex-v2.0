Ext.define ('Webed.view.ContentTabs', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.content-tabs',

    requires: [
        'Ext.form.field.TextArea',
        'Ext.layout.container.Absolute'
    ],

    html: Ext.fly ('content').getHTML ()
});
