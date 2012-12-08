Ext.define ('Webed.controller.ContentTabs', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'content-tabs', ref: 'contentTabs'
    },{
        selector: 'node-tree', ref: 'nodeTree' // TODO: Eliminate!?
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'content-tabs' : {
                render: this.render,
                tabchange: this.tabchange,
                beforeadd: this.beforeadd,
                remove: this.remove
            }
        });

        this.application.on ({
            nodeselect: this.add_tab, scope: this
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    render: function (view, eOpts) {
        var wrap = Ext.fly ('content-wrap');
        assert (wrap); wrap.destroy ();
    },

    beforeadd: function (view, component, index) {
        if (view.items.length == 0) {
            var wrap = Ext.fly ('page-wrap');
            assert (wrap); wrap.setDisplayed (false);
        }
    },

    remove: function (view, component) {
        if (view.items.length == 0) {
            var wrap = Ext.fly ('page-wrap');
            assert (wrap); wrap.setDisplayed (true);
        }
    },

    tabchange: function (view, newCard, oldCard, eOpts) {
        assert (newCard);
        assert (newCard.record);

        this.application.fireEvent ('nodeselect', this, {
            record: newCard.record
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    add_tab: function (source, args) {
        if (source == this) return;

        assert (args);
        var record = args.record;
        assert (record);

        var mime = record.get ('mime');
        if (mime) {
            switch (mime) {
                case 'text/plain':
                    this.add_text_tab (record);
                    break;

                default:
                    console.debug ('[ContentTabs.add_tab] nop for', mime);
            }
        }
    },

    add_text_tab: function (record) {

        var uuid = record.get ('uuid');
        assert (uuid);
        var tree = this.getNodeTree ();
        assert (tree);
        var base = tree.getRootNode ();
        assert (base);
        var node = base.findChild ('uuid', uuid, true);
        if (!node || node.isLeaf () == false) {
            return;
        }

        var name = node.get ('name');
        assert (name);
        var iconCls = node.get ('iconCls');
        assert (iconCls);
        var view = this.getContentTabs ();
        assert (view);

        var tabs = view.queryBy (function (el) {
            return (el.record && el.record.get ('uuid') == uuid)
                ? true : false;
        }, this);

        assert (tabs);
        var tab = (tabs.length > 0) ? tabs[0] : view.add ({
            record: record,
            title: name,
            closable: true,
            iconCls: iconCls,
            layout: 'fit',

            items: [{
                xtype: 'textarea',
                value: '...'
            }]
        });

        assert (tab);
        view.setActiveTab (tab);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
