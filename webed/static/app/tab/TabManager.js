Ext.define ('Webed.tab.TabManager', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.tab-manager',

    requires: [
        'Ext.layout.container.Absolute'
    ],

    html: Ext.fly ('content').getHTML ()
});
