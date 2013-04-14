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
                    background: 'black url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAACMAQMAAAEGu+TCAAAABlBMVEUAAAD///+l2Z/dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QQNDTMgokMN5wAAA1NJREFUSMeVVUFIW0EQnc2PX9vUJCBKgrXkULy0Uk/pwVj+sb15kkKhRISkFbd6Kub2e7CHXrxGBMnRS8GD/RbqIWChl0Jy8KDdUgqFemnBIngp1M7M/v+z/xutHcLuzL7dmdk38zcALGNNGGuQ4myCyJEy2AThMtaE2zyPuNDzFiBLK1qeu1B8T4q7D4kpUmyXfih9LtzlPdMNSLRZcwDu49Tvub7Z733OgmOrr767zIALidHAOQyxFoBXPIw84AUmjCpys+lb4mawbtO6rSgaSVHN0/AEOHFwLIljrwyC5EYIwKHA5kQZh2En8DWxSOaifxYsBIQVoPYXHNIq2JtUjoPDYgBPyGDQ0g6HM/JOem6aFE/JhmgaiK2kxxF6EPIawoDu0LVkL6c26KkpA8KV8f35cdY3LNWMBEt52v62LDdieVjevr9HbrkxrBh46dmJAsNyWUPTai6KJHaljpW4oeRWBMrCjEeFoaLjDZuxWFD2tVMXLpLEg0K3ZfFIbsN1nH3XNDsWdq8knuJHCiHLKUkFSOrZSei5nDQ98/iYqH+WBmQYI7XJ4y2sDkzxvHkmn0JYj0TbekNXElO92zzvadtvoVAb1MRl09y44sNVXd/skHrYlYgev3JpvwZD6qnfP9GaiHg5U76/1BLz6aS6+h+Wr3weT9h+7e3x/NP7ZGYd3sMvfHLEU0t4++Skx/cge84pdOEn6Ia0kswHNgzzE9iG9EVbxP/+xClE7MuKnZt5eZl9ml6xXjvEnwtCF1n8bpWOW5P1kF6Nh3Z+jfFVepH+lQgNVX1+vYYHqF3wsP8DuGbidW2HeEXvj0uRcnJDPf+Dk2IXMB/kZJGLkwX6FPVOjlKhnXzUZrzmnpMzymxTn9V2/sVas1rPhI9Ki1z8Co8LZMOuroa2vYB/N6WjrqTkunzbJr90uVm8v/l+nNQOO86FK7AEJ+X/6Ih7ePl5w1bof9eI/wfxWfPbQPzjBf7ESmwhU61HFwxyNP+d/LE/zyWnIx3cxuTKlY5NzXFghKtQ83QecCLn+OD7eVybnvWeo3ykv3NihZujHNRerHJzlcP6ZRiv5Lr2P62V4rYd/YS4vi2DIr6CUWKL8QsosjFEyeiA/E40KkD8CbjckwB/ARSzUvlYJiU7AAAAAElFTkSuQmCC) no-repeat center;'
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
