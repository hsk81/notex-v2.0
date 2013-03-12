Ext.define ('Webed.view.EditorTab', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editor-tab',

    requires: [
        'Webed.view.EditorTBar.txt',
        'Webed.view.EditorTBar.rst'
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
                xtype: (flag['tbar']) ? flag['tbar'] :'editor-tbar-txt'
            };
        } (this.mime);

        this.callParent (arguments);
        this.items.add (this.code_area);
    },

    listeners: {
        afterlayout: function (panel) {
            var tbar = assert (panel.child ('toolbar'));
            var ca = assert (panel.child ('code-area'));

            var height1 = panel.getHeight ();
            assert (typeof (height1) == 'number');
            var height2 = tbar.getHeight ();
            assert (typeof (height2) == 'number');

            ca.setHeight (height1 - height2 - 2);
        },

        activate: function (panel) {
            assert (panel.child ('code-area')).focus (true, 125);
        },

        beforeclose: function (panel) {
            console.debug ('[before-close]', panel);
        }
    }
});
