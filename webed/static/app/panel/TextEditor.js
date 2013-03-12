Ext.define ('Webed.panel.TextEditor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.text-editor',

    requires: [
        'Webed.toolbar.TextToolbar',
        'Webed.toolbar.RestToolbar'
    ],

    closable: true,
    layout: 'fit',

    config: {
        record: undefined,
        code_area: undefined
    },

    constructor: function (config) {
        this.initConfig (config);
        assert (this.record);
        assert (this.code_area);

        this.iconCls = assert (this.record.get ('iconCls'));
        this.title = assert (this.record.get ('name'));
        this.mime = assert (this.record.get ('mime'));

        this.tbar = function (mime) {
            var store = assert (Ext.getStore ('MIMEs'));
            var record = assert (store.findRecord ('mime', mime));
            var flag = assert (record.get ('flag'));

            return {
                xtype: (flag['tbar']) ? flag['tbar'] :'text-toolbar'
            };
        } (this.mime);

        this.callParent (arguments);
        this.items.add (this.code_area);
    }
});
