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
        xtype: 'webed-statusbar-theme'
    },'-',{
        text: '100%'
    },{
        xtype: 'webed-statusbar-slider'
    }]
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

    emptyText: 'Spell check language ..'
});

Ext.define ('Webed.view.StatusBar.Theme', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.webed-statusbar-theme',

    store: {
        fields: ['theme', 'name'],
        data : [{
            'theme':'default', 'name':'Default'
        },{
            'theme':'ambiance', 'name':'Ambiance'
        },{
            'theme':'ambiance-mobile', 'name':'Ambiance Mobile'
        },{
            'theme':'blackboard', 'name':'Blackboard'
        },{
            'theme':'cobalt', 'name':'Cobalt'
        },{
            'theme':'eclipse', 'name':'Eclipse'
        },{
            'theme':'elegant', 'name':'Elegant'
        },{
            'theme':'erlang-dark', 'name':'Erlang Dark'
        },{
            'theme':'lesser-dark', 'name':'Lesser Dark'
        },{
            'theme':'monokai', 'name':'Monokai'
        },{
            'theme':'neat', 'name':'Neat'
        },{
            'theme':'night', 'name':'Night'
        },{
            'theme':'rubyblue', 'name':'Rubyblue'
        },{
            'theme':'solarized', 'name':'Solarized'
        },{
            'theme':'twilight', 'name':'Twilight'
        },{
            'theme':'vibrant-ink', 'name':'Vibrant Ink'
        },{
            'theme':'xq-dark', 'name':'XQ Dark'
        }]
    },

    queryMode: 'local',
    displayField: 'name',
    valueField: 'theme',

    emptyText: 'Editor theme ..'
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

    tooltip: '<b>Line:Char</b> or <b>Lines:Words:Chars</b>',
    text: '',
    disabled: true,
    width: 64
});

Ext.define ('Webed.view.statusBar.Slider', {
    extend: 'Ext.slider.Single',
    alias: 'widget.webed-statusbar-slider',

    width : 128,
    increment : 25,
    value : 100,
    minValue : 50,
    maxValue : 150
});
