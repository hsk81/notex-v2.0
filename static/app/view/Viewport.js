Ext.define ('Webed.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',

    requires: [
        'Webed.view.MainBar',
        'Webed.view.SetTree',
        'Webed.view.DocList',
        'Webed.view.ContentTabs',
        'Webed.view.StatusBar'
    ],

    items: [{
        layout: 'border',
        items: [{
            region: 'west',
            title: 'Projects',
            collapsible: true,
            split: true,
            minWidth: 256,
            flex: 1,

            tools: [{
                type: 'refresh',
                tooltip: '<p>Refresh</p>',
                action: 'set-tree:refresh'
            },{
                type: 'gear',
                tooltip: '<p>Settings</p>',
                action: 'set-tree:settings'
            }],

            layout: 'border',
            items: [{
                region: 'center',
                xtype: 'set-tree',
                flex: 1
            },{
                region: 'south',
                xtype: 'doc-list',
                title: 'Documents',
                collapsible: true,
                collapseMode: 'header',
                split: true,
                flex: 1,

                tools: [{
                    type: 'refresh',
                    tooltip: '<p>Refresh</p>',
                    action: 'refresh'
                },{
                    type: 'gear',
                    tooltip: '<p>Settings</p>',
                    action: 'settings'
                }]
            }]
        },{
            region: 'center',
            xtype: 'content-tabs',
            tabPosition: 'bottom',
            flex: 4,

            tbar: {
                xtype: 'main-bar'
            }
        }],

        bbar: {
            xtype: 'status-bar'
        }
    }],

    listeners: {
        afterlayout: function () {
            var ld = Ext.get ('load-progress');
            if (ld) ld.destroy ();
        }
    }
});
