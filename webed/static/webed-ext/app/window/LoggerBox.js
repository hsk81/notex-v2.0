Ext.define ('Webed.window.LoggerBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.logger-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-information-16',
    height: 240,
    layout: 'fit',
    minHeight: 240,
    minWidth: 360,
    modal: false,
    resizable: true,
    title: 'Logger',
    width: 360,

    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: '4px'
    }],

    config: {
        value: ''
    },

    listeners: {
        render: function (self) {
            var code_area = Ext.create ('Webed.form.field.CodeArea', {
                mime: 'text/plain', options: {readOnly: true}
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
            ca.setHeight (height - 9);
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
