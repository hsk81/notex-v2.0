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
            collapsible: true,
            collapsed: true,
            flex: 1,
            minWidth: 281,
            name: 'projects',
            layout: 'border',
            region: 'west',
            split: true,
            title: '·····',

            tools: [{
                type: 'refresh',
                tooltip: '<p>Refresh</p>',
                action: 'node-tree:refresh'
            },{
                type: 'help',
                tooltip: '<div>Project Tree&nbsp;<div class="w-shortcut">[F9]</div></div>'
            }],

            listeners: {
                expand: function (self) { self.setTitle ('Projects'); },
                beforecollapse: function (self) { self.setTitle ('·····'); }
            },

            items: [{
                flex: 1,
                region: 'center',
                xtype: 'node-tree'
            },{
                border: false,
                height: 277,
                layout: 'fit',
                name: 'advertisement',
                region: 'south',
                title: 'Advertisement',

                listeners: {
                    afterrender: function (self) {
                        var el = self.getEl ();
                        el.insertHtml ('afterBegin', [
                            '<div id="ad-wrap" style="width:100%; height:100%;">',
                            '<span id="ad-wrap-span">',

                            '<script type="text/javascript"><!--',
                            'google_ad_client = "ca-pub-0141161703803018";',
                            'google_ad_slot = "6190750994";',
                            'google_ad_width = 300;',
                            'google_ad_height = 250;',
                            '//--></script>',

                            '</span>',
                            '</div>'
                        ].join ('\n'));

                        var ad = document.createElement('script');
                        ad.type = 'text/javascript';
                        ad.src = "https://pagead2.googlesyndication.com/pagead/show_ads.js";

                        var span = document.getElementById ('ad-wrap-span');
                        span.appendChild (ad);
                    }
                }
            },{
                collapsible: true,
                collapseMode: 'header',
                flex: 1,
                name: 'documents',
                region: 'south',
                split: true,
                title: 'Documents',
                xtype: 'leaf-list',

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
            border: false,
            flex: 4,
            name: 'hbox',
            layout: {type: 'hbox', align: 'stretch'},
            region: 'center',
            style: {borderStyle: 'solid', borderWidth: '0 0 0 1px'},

            items: [{
                border: false,
                flex: 1,
                layout: {type: 'vbox', align: 'stretch'},
                name: 'vbox',

                items: [{
                    border: false,
                    flex: 1,
                    tabPosition: 'bottom',
                    xtype: 'tab-manager'
                }]
            }]
        }]
    }]
});
