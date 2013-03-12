Ext.define ('Webed.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',

    requires: [
        'Ext.layout.container.Border',
        'Webed.view.MainBar',
        'Webed.view.NodeTree',
        'Webed.view.LeafList',
        'Webed.statusbar.StatusBar',
        'Webed.tab.TabManager'
    ],

    items: [{
        layout: 'border',
        items: [{
            border: false,
            region: 'west',
            title: 'Projects',
            collapsible: true,
            split: true,
            minWidth: 281,
            flex: 1,

            tools: [{
                type: 'refresh',
                tooltip: '<p>Refresh</p>',
                action: 'node-tree:refresh'
            },{
                type: 'help',
                tooltip: '<div>Project Tree&nbsp;<div class="w-shortcut">[F9]</div></div>'
            }],

            layout: 'border',
            items: [{
                region: 'center',
                xtype: 'node-tree',
                flex: 1
            },{
                region: 'south',
                xtype: 'leaf-list',
                title: 'Documents',
                collapsible: true,
                collapseMode: 'header',
                split: true,
                flex: 1,

                tools: [{
                    type: 'refresh',
                    tooltip: '<p>Refresh</p>',
                    action: 'leaf-list:refresh'
                },{
                    type: 'help',
                    tooltip: '<div>Document List&nbsp;<div class="w-shortcut">[F10]</div></div>'
                }]
            }]
        },{
            region: 'center',
            flex: 4,

            layout: 'fit',
            items: [{
                border: false,
                xtype: 'tab-manager',
                tabPosition: 'bottom'
            }],

            tbar: {xtype: 'main-bar' },
            bbar: {xtype: 'webed-statusbar'}
        }]
    }],

    listeners: {
        afterlayout: function () {
            var ld = Ext.get ('load-progress');
            if (ld) ld.destroy ();
        }
    }
});
