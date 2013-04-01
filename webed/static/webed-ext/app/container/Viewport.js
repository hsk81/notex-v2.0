Ext.define ('Webed.container.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',

    requires: [
        'Ext.layout.container.Border',
        'Webed.grid.LeafList',
        'Webed.statusbar.StatusBar',
        'Webed.tab.TabManager',
        'Webed.toolbar.MainToolbar',
        'Webed.tree.NodeTree'
    ],

    items: [{
        layout: 'border',
        items: [{
            border: false,
            region: 'west',
            title: 'Projects',
            name: 'projects',
            collapsible: true,
            collapsed: true,
            layout: 'border',
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

            items: [{
                region: 'center',
                xtype: 'node-tree',
                flex: 1
            },{
                region: 'south',
                xtype: 'leaf-list',
                title: 'Documents',
                name: 'documents',
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

            border: false,
            style: {
                borderStyle: 'solid',
                borderWidth: '0 0 0 1px'
            },

            flex: 4,
            name: 'hbox',
            layout: {type: 'hbox', align: 'stretch'},

            items: [{
                border: false,
                flex: 1,
                name: 'vbox',
                layout: {type: 'vbox', align: 'stretch'},

                items: [{
                    border: false,
                    xtype: 'tab-manager',
                    tabPosition: 'bottom',
                    flex: 1
                }]
            }]
        }]
    }]
});
