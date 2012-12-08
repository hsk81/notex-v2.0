Ext.define ('Webed.view.ContentTabs', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.content-tabs',

    requires: [
        'Ext.form.field.TextArea'
    ],

    html: Ext.fly ('content').getHTML ()
});
