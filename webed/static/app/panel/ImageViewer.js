Ext.define ('Webed.panel.ImageViewer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.image-viewer',

    autoScroll: true,
    bodyStyle: 'background: grey;',
    closable: true,
    layout: 'absolute',

    config: {
        record: undefined
    },

    constructor: function (config) {
        this.initConfig (config);
        var record = assert (this.getRecord ());

        this.iconCls = assert (record.get ('iconCls'));
        this.title = assert (record.get ('name'));
        this.mime = assert (record.get ('mime'));

        this.callParent (arguments);
    }
});
