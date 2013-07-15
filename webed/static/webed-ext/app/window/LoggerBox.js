Ext.define ('Webed.window.LoggerBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.logger-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-information-16',
    height: 480,
    layout: 'fit',
    minHeight: 240,
    minWidth: 320,
    modal: false,
    resizable: true,
    title: 'Logger',
    width: 640,

    items: [{
        xtype: 'form',
        layout: 'fit'
    }],

    config: {
        value: ''
    },

    listeners: {
        render: function (self) {
            var code_area = Ext.create ('Webed.form.field.CodeArea', {
                mime: 'text/plain'
            });

            var form = assert (self.down ('form'));
            form.add (code_area);
        },

        afterlayout: function (self) {
            var ca = assert (self.down ('code-area'));
            if (!ca.getValue ()) ca.setValue (self.getValue ());

            var body = assert (self.body);
            var height = body.getHeight ();
            assert (typeof (height) == 'number');
            ca.setHeight (height - 2);
        },

        close: function (self) {
            var ca = assert (self.down ('code-area'));
            ca.destroy ();
        }
    },

    constructor: function (config) {
        this.initConfig (config);
        this.callParent (arguments);
    }
});
