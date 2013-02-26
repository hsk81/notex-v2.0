Ext.Loader.setPath ({
    'Ext.ux': '../static/lib/extjs/examples/ux'
});

Ext.define ('Webed.view.StatusBar', {
    extend: 'Ext.ux.statusbar.StatusBar',
    alias: 'widget.webed-statusbar',
    text: 'WebEd',
    items: [{
        xtype: 'webed-statusbar-progressbar'
    },'-',{
        xtype: 'webed-statusbar-infobutton'
    },'-',{
        xtype: 'webed-statusbar-spellcheck'
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
    alias: 'widget.webed-statusbar-spellcheck',

    store: {
        fields: ['lang', 'name'],
        data : [{
            "lang":"en_US", "name":"English: United States"
        },{
            "lang":"de_CH", "name":"German: Switzerland"
        },{
            "lang":"tr_TR", "name":"Turkish: Turkey"
        }]
    },

    queryMode: 'local',
    displayField: 'name',
    valueField: 'lang',

    emptyText: 'Language ..'
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

    width : 128,
    increment : 25,
    value : 100,
    minValue : 25,
    maxValue : 175
});
