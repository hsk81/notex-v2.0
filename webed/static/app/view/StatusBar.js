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

    store: {
        fields: [
            'lingua', 'name', 'charset', 'charset_aff', 'charset_dic'
        ],
        data : [{
            lingua: 'ar_ANY',
            charset: 'UTF-8',
            name: "Al-ʻarabīyah: Intl"
        },{
            lingua: 'de_AT',
            charset: 'ISO8859-15',
            name: 'Deutsch: Österreich'
        },{
            lingua: 'de_BE',
            charset: 'ISO8859-15',
            name: 'Deutsch: Belgien'
        },{
            lingua: 'de_BE',
            charset: 'ISO8859-15',
            name: 'Deutsch: Schweiz'
        },{
            lingua: 'de_DE',
            charset: 'ISO8859-15',
            name: 'Deutsch: Deutschland'
        },{
            lingua: 'de_LI',
            charset: 'ISO8859-15',
            name: 'Deutsch: Lichtenstein'
        },{
            lingua: 'de_LU',
            charset: 'ISO8859-15',
            name: 'Deutsch: Luxemburg'
        },{
            lingua: 'en_AG',
            charset: 'ISO8859-15',
            name: 'English: Antigua And Barbuda'
        },{
            lingua: 'en_AU',
            charset: 'ISO8859-15',
            name: 'English: Australia'
        },{
            lingua: 'en_BS',
            charset: 'ISO8859-15',
            name: 'English: Bahamas'
        },{
            lingua: 'en_BW',
            charset: 'ISO8859-15',
            name: 'English: Botswana'
        },{
            lingua: 'en_BZ',
            charset: 'ISO8859-15',
            name: 'English: Belize'
        },{
            lingua: 'en_CA',
            charset: 'UTF-8',
            name: 'English: Canada'
        },{
            lingua: 'en_DK',
            charset: 'ISO8859-15',
            name: 'English: Denmark'
        },{
            lingua: 'en_GB',
            charset: 'ISO8859-15',
            name: 'English: United Kingdom'
        },{
            lingua: 'en_GH',
            charset: 'ISO8859-15',
            name: 'English: Ghana'
        },{
            lingua: 'en_HK',
            charset: 'ISO8859-15',
            name: 'English: Hong Kong'
        },{
            lingua: 'en_IE',
            charset: 'ISO8859-15',
            name: 'English: Ireland'
        },{
            lingua: 'en_IN',
            charset: 'ISO8859-15',
            name: 'English: India'
        },{
            lingua: 'en_JM',
            charset: 'ISO8859-15',
            name: 'English: Jamaica'
        },{
            lingua: 'en_NA',
            charset: 'ISO8859-15',
            name: 'English: Namibia'
        },{
            lingua: 'en_NG',
            charset: 'ISO8859-15',
            name: 'English: Nigeria'
        },{
            lingua: 'en_NZ',
            charset: 'ISO8859-15',
            name: 'English: New Zealand'
        },{
            lingua: 'en_PH',
            charset: 'UTF-8',
            name: 'English: Philippines'
        },{
            lingua: 'en_SG',
            charset: 'ISO8859-15',
            name: 'English: Singapore'
        },{
            lingua: 'en_TT',
            charset: 'ISO8859-15',
            name: 'English: Trinidad And Tobago'
        },{
            lingua: 'en_US',
            charset: 'UTF-8',
            name: 'English: United States'
        },{
            lingua: 'en_ZA',
            charset: 'ISO8859-15',
            name: 'English: South Africa'
        },{
            lingua: 'en_ZW',
            charset: 'ISO8859-15',
            name: 'English: Zimbabwe'
        },{
            lingua: 'tr_TR',
            charset: 'UTF-8',
            name: 'Türkçe: Türkiye'
        }]
    },

    queryMode: 'local',
    displayField: 'name',
    valueField: 'lingua',
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
