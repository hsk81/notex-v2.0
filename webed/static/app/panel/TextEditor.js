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
        codeArea: undefined
    },

    constructor: function (config) {
        this.initConfig (config);

        var record = assert (this.getRecord ());
        var code_area = assert (this.getCodeArea ());

        this.iconCls = assert (record.get ('iconCls'));
        this.title = assert (record.get ('name'));
        this.mime = assert (record.get ('mime'));

        this.tbar = function (mime) {
            var store = assert (Ext.getStore ('MIMEs'));
            var record = assert (store.findRecord ('mime', mime));
            var flag = assert (record.get ('flag'));

            return {
                xtype: (flag['tbar']) ? flag['tbar'] :'text-toolbar'
            };
        } (this.mime);

        this.callParent (arguments);
        this.items.add (code_area);
    }
});
