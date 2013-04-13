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
            minWidth: 300,
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
                height: 275,
                layout: 'fit',
                name: 'advertisement',
                region: 'south',
                title: 'Advertisement',

                bodyStyle: {
                    backgroundColor: 'black'
                },

                html: function () {
                    var ad = Ext.get ('ad-wrap');
                    if (ad) {
                        var html = ad.getHTML ();
                        ad.destroy ();
                        return html;
                    } else {
                        return undefined;
                    }
                }(),

                listeners: {
                    afterrender: function (self) {
                        var ad_banner = Ext.get ('ad-banner-wrap');
                        if (ad_banner) ad_banner.show ();

                        window.google_ad_client = "ca-pub-0141161703803018";
                        window.google_ad_slot = "6190750994";
                        window.google_ad_width = 300;
                        window.google_ad_height = 250;

                        var ad = Ext.get ('ad-wrap');
                        if (ad) {
                            var write = document.write;
                            document.write = function (content) {
                                ad.dom.innerHTML = content;
                                document.write = write;
                            };

                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.src = "https://" +
                                "pagead2.googlesyndication.com/" +
                                "pagead/show_ads.js";

                            ad.appendChild (script);
                        } else {
                            self.hide ();
                        }
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
