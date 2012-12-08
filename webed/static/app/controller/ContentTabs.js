Ext.define ('Webed.controller.ContentTabs', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'content-tabs', ref: 'contentTabs'
    },{
        selector: 'node-tree', ref: 'nodeTree'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'content-tabs' : { tabchange: this.tabchange }
        });

        this.application.on ({
            nodeclick: this.add_tab, scope: this
        });
    },

    tabchange: function (tabPanel, newCard, oldCard, eOpts) {
        assert (newCard);
        assert (newCard.record);

        this.application.fireEvent ('nodeclick', this, {
            record: newCard.record
        });
    },

    add_tab: function (source, args) {
        if (source == this) return;

        assert (args);
        var record = args.record;
        assert (record);

        var uuid = record.get ('uuid');
        assert (uuid);
        var tree = this.getNodeTree ();
        assert (tree);
        var base = tree.getRootNode ();
        assert (base);
        var node = base.findChild ('uuid', uuid, true);
        assert (node);

        if (node.isExpandable ()) {
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
            iconCls: iconCls
        });

        assert (tab);
        view.setActiveTab (tab);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
