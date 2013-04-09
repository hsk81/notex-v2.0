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
        afterlayout: function () {
            if (location.hash) {
                var id = location.hash.slice (1);
                if (id) {
                    var el = Ext.get (id);
                    if (el) {
                        var top = el.getTop ();
                        if (top && top > 0) {
                            var pwc = Ext.get ('page-wrap-content');
                            if (pwc) pwc.scroll ('down', top);
                        }
                    }
                }
            }
        }
    },

    html: Ext.fly ('content').getHTML ()
});
