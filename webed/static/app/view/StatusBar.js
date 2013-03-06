Ext.Loader.setPath ({
    'Ext.ux': '../static/lib/extjs/examples/ux'
});

Ext.define ('Webed.view.StatusBar', {
    extend: 'Ext.ux.statusbar.StatusBar',
    alias: 'widget.webed-statusbar',
    defaultText: 'WebEd',
    items: [{
        xtype: 'webed-statusbar-progressbar'
    },'-',{
        xtype: 'webed-statusbar-infobutton'
    },'-',{
        xtype: 'webed-statusbar-lingua'
    },'-',{
        xtype: 'webed-statusbar-sizebutton'
    },{
        xtype: 'webed-statusbar-slider'
    }]
});

Ext.define ('Webed.view.statusBar.ProgressBar', {
    extend: 'Ext.ProgressBar',
    alias: 'widget.webed-statusbar-progressbar',

    width: 256,
    value: 0.0,
    hidden: true,

    interval: 125, //[ms]
    increment: 80, // #segments

    total: 0, //[ms]
    setTotal: function (value) { this.total = value; },
    message: 'Processing',
    setMessage: function (value) { this.message = value; }
});

Ext.define ('Webed.view.statusBar.InfoButton', {
    extend: 'Ext.Button',
    alias: 'widget.webed-statusbar-infobutton',
    tooltip:
        '<b>Line</b>:<b>Char</b> or <b>Lines</b>:<b>Words</b>:<b>Chars</b>',
    text: '',
    minWidth: 64
});

Ext.define ('Webed.view.StatusBar.SpellCheck', {
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
        '<tpl if="!hidden">',

            '<div class="x-boundlist-item">{name}',
            '<div class="w-boundlist-item">',
                '<ul>',
                '<li class="w-boundlist-item-text">{country}</li>',
                '<li class="w-boundlist-item-icon {flag}-16"></li>',
                '</ul>',
            '</div>',
            '</div>',

        '</tpl>',
        '</tpl>'
    ],

    emptyText: 'Language ..',
    width: 224
});

Ext.define ('Webed.view.statusBar.SizeButton', {
    extend: 'Ext.Button',
    alias: 'widget.webed-statusbar-sizebutton',
    tooltip: 'Font Size',
    text: '100%',
    width: 48
});

Ext.define ('Webed.view.statusBar.Slider', {
    extend: 'Ext.slider.Single',
    alias: 'widget.webed-statusbar-slider',

    tipText: function (thumb) {
        return 'Font Size: {0}%'.format (thumb.value);
    },

    width: 128,
    increment: 25,
    value: 100,
    minValue: 25,
    maxValue: 175
});
