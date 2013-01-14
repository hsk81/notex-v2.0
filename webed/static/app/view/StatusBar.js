Ext.Loader.setPath ({
    'Ext.ux': '../static/lib/extjs/examples/ux'
});

Ext.define ('Webed.view.StatusBar', {
    extend: 'Ext.ux.statusbar.StatusBar',
    alias: 'widget.status-bar',
    text: 'WebEd',
    items: [{
        xtype: 'statusbar.progressbar'
    },'-',{
        xtype: 'statusbar.infobutton'
    },'-',{
        xtype: 'statusbar.spellcheck'
    },'-',{
        text: '100%'
    },{
        xtype: 'statusbar.slider'
    }]
});

Ext.define ('Webed.view.statusBar.SpellCheck', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.statusbar.spellcheck',

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

    emptyText: 'Spell check language ..'
});

Ext.define ('Webed.view.statusBar.ProgressBar', {
    extend: 'Ext.ProgressBar',
    alias: 'widget.statusbar.progressbar',

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
    alias: 'widget.statusbar.infobutton',

    tooltip: '<b>Line:Char</b> or <b>Lines:Words:Chars</b>',
    text: '',
    disabled: true,
    width: 64
});

Ext.define ('Webed.view.statusBar.Slider', {
    extend: 'Ext.slider.Single',
    alias: 'widget.statusbar.slider',

    width : 128,
    increment : 25,
    value : 100,
    minValue : 50,
    maxValue : 150
});
