Ext.define ('Webed.tab.TabManager', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.tab-manager',

    requires: [
        'Ext.layout.container.Absolute'
    ],

    config: {
        focused: true
    },

    listeners: {
        render: function () {
            var menu = assert (Ext.fly ('cssmenu'));
            var item = assert (menu.down ('li[clazz=active]'));
            item.addCls ('active');
        }
    },

    html: Ext.fly ('content').getHTML ()
});
