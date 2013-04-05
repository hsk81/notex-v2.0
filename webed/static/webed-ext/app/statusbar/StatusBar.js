Ext.define ('Webed.statusbar.StatusBar', {
    extend: 'Ext.ux.statusbar.StatusBar',
    alias: 'widget.webed-statusbar',

    requires: [
        'Webed.controller.statusbar.StatusBar' // fix: avoids dynamic load!
    ],

    items: [{
        xtype: 'webed-statusbar-progressbar'
    },'-',{
        xtype: 'webed-statusbar-infobutton'
    },'-',{
        xtype: 'webed-statusbar-lingua'
    },'-',{
        xtype: 'webed-statusbar-zoombutton'
    },{
        xtype: 'webed-statusbar-zoomslider'
    }],

    defaultText: 'NoTex',
    hidden: true
});

Ext.define ('Webed.statusbar.ProgressBar', {
    extend: 'Ext.ProgressBar',
    alias: 'widget.webed-statusbar-progressbar',

    width: 256,
    value: 0.0,
    hidden: true,
    interval: 125, //[ms]
    increment: 80, // #segments

    total: 0, //[ms]
    setTotal: function (value) { this.total = value; },
    getTotal: function () { return this.total; },

    message: 'Processing',
    setMessage: function (value) { this.message = value; },
    getMessage: function () { return this.message; }
});

Ext.define ('Webed.statusbar.InfoButton', {
    extend: 'Ext.Button',
    alias: 'widget.webed-statusbar-infobutton',
    tooltip:
        '<b>Line</b>:<b>Char</b> or <b>Lines</b>:<b>Words</b>:<b>Chars</b>',
    text: '',
    minWidth: 64
});

Ext.define ('Webed.statusbar.Lingua', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.webed-statusbar-lingua',

    requires: [
        'Webed.store.Linguas'
    ],

    store: 'Linguas',
    queryMode: 'local',
    valueField: 'lingua',
    displayField: 'full',
    typeAhead: true,

    tpl: [
        '<tpl for=".">',

            '<div class="x-boundlist-item">{name}',
            '<div class="w-boundlist-item">',
                '<ul>',
                '<li class="w-boundlist-item-text">{country}</li>',
                '<li class="w-boundlist-item-icon {icon}-16"></li>',
                '</ul>',
            '</div>',
            '</div>',

        '</tpl>'
    ],

    initComponent: function () {
        this.callParent (arguments);

        assert (this.getStore ()).filter ([{
            filterFn: function (record) {
                return !assert (record.get ('flag')).hidden;
            }
        }]);
    },

    beforeDestroy: function () {
        assert (this.getStore ()).clearFilter ();
    },

    emptyText: 'Language ..',
    width: 224
});

Ext.define ('Webed.statusbar.ZoomButton', {
    extend: 'Ext.Button',
    alias: 'widget.webed-statusbar-zoombutton',
    tooltip: 'Zoom',
    text: '100%',
    width: 48
});

Ext.define ('Webed.statusbar.ZoomSlider', {
    extend: 'Ext.slider.Single',
    alias: 'widget.webed-statusbar-zoomslider',

    tipText: function (thumb) {
        return 'Zoom: {0}%'.format (thumb.value);
    },

    width: 128,
    increment: 25,
    value: 100,
    minValue: 25,
    maxValue: 175
});
