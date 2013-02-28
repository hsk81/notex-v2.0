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
        data: [{
            lingua: 'ar_ANY',
            charset: 'utf-8',
            name: 'Al-ʻarabīyah: INTL'
        },{
            lingua: 'de_AT',
            charset: 'iso-8859-1',
            name: 'Deutsch: Österreich'
        },{
            lingua: 'de_BE',
            charset: 'iso-8859-1',
            name: 'Deutsch: Belgien'
        },{
            lingua: 'de_CH',
            charset: 'iso-8859-1',
            name: 'Deutsch: Schweiz'
        },{
            lingua: 'de_DE',
            charset: 'iso-8859-1',
            name: 'Deutsch: Deutschland'
        },{
            lingua: 'de_LI',
            charset: 'iso-8859-1',
            name: 'Deutsch: Lichtenstein'
        },{
            lingua: 'de_LU',
            charset: 'iso-8859-1',
            name: 'Deutsch: Luxemburg'
        },{
            lingua: 'en_AG',
            charset: 'iso-8859-1',
            name: 'English: Antigua And Barbuda'
        },{
            lingua: 'en_AU',
            charset: 'iso-8859-1',
            name: 'English: Australia'
        },{
            lingua: 'en_BS',
            charset: 'iso-8859-1',
            name: 'English: Bahamas'
        },{
            lingua: 'en_BW',
            charset: 'iso-8859-1',
            name: 'English: Botswana'
        },{
            lingua: 'en_BZ',
            charset: 'iso-8859-1',
            name: 'English: Belize'
        },{
            lingua: 'en_CA',
            charset: 'us-ascii',
            name: 'English: Canada'
        },{
            lingua: 'en_DK',
            charset: 'iso-8859-1',
            name: 'English: Denmark'
        },{
            lingua: 'en_GB',
            charset: 'iso-8859-1',
            name: 'English: United Kingdom'
        },{
            lingua: 'en_GH',
            charset: 'iso-8859-1',
            name: 'English: Ghana'
        },{
            lingua: 'en_HK',
            charset: 'iso-8859-1',
            name: 'English: Hong Kong'
        },{
            lingua: 'en_IE',
            charset: 'iso-8859-1',
            name: 'English: Ireland'
        },{
            lingua: 'en_IN',
            charset: 'iso-8859-1',
            name: 'English: India'
        },{
            lingua: 'en_JM',
            charset: 'iso-8859-1',
            name: 'English: Jamaica'
        },{
            lingua: 'en_NA',
            charset: 'iso-8859-1',
            name: 'English: Namibia'
        },{
            lingua: 'en_NG',
            charset: 'iso-8859-1',
            name: 'English: Nigeria'
        },{
            lingua: 'en_NZ',
            charset: 'iso-8859-1',
            name: 'English: New Zealand'
        },{
            lingua: 'en_PH',
            charset: 'us-ascii',
            name: 'English: Philippines'
        },{
            lingua: 'en_SG',
            charset: 'iso-8859-1',
            name: 'English: Singapore'
        },{
            lingua: 'en_TT',
            charset: 'iso-8859-1',
            name: 'English: Trinidad And Tobago'
        },{
            lingua: 'en_US',
            charset: 'us-ascii',
            name: 'English: United States'
        },{
            lingua: 'en_ZA',
            charset: 'iso-8859-1',
            name: 'English: South Africa'
        },{
            lingua: 'en_ZW',
            charset: 'iso-8859-1',
            name: 'English: Zimbabwe'
        },{
            lingua: 'es_ANY',
            charset: 'iso-8859-1',
            name: 'Español: INTL'
        },{
            lingua: 'es_AR',
            charset: 'iso-8859-1',
            name: 'Español: Argentina'
        },{
            lingua: 'es_BO',
            charset: 'iso-8859-1',
            name: 'Español: Bolivia'
        },{
            lingua: 'es_CL',
            charset: 'iso-8859-1',
            name: 'Español: Chile'
        },{
            lingua: 'es_CO',
            charset: 'iso-8859-1',
            name: 'Español: Colombia'
        },{
            lingua: 'es_CR',
            charset: 'iso-8859-1',
            name: 'Español: Costa Rica'
        },{
            lingua: 'es_CU',
            charset: 'iso-8859-1',
            name: 'Español: Cuba'
        },{
            lingua: 'es_DO',
            charset: 'iso-8859-1',
            name: 'Español: La República Dominicana'
        },{
            lingua: 'es_EC',
            charset: 'iso-8859-1',
            name: 'Español: Ecuador'
        },{
            lingua: 'es_ES',
            charset: 'iso-8859-1',
            name: 'Español: España'
        },{
            lingua: 'es_GT',
            charset: 'iso-8859-1',
            name: 'Español: Guatemala'
        },{
            lingua: 'es_HN',
            charset: 'iso-8859-1',
            name: 'Español: Honduras'
        },{
            lingua: 'es_MX',
            charset: 'iso-8859-1',
            name: 'Español: México'
        },{
            lingua: 'es_NI',
            charset: 'iso-8859-1',
            name: 'Español: Nicaragua'
        },{
            lingua: 'es_PA',
            charset: 'iso-8859-1',
            name: 'Español: Panamá'
        },{
            lingua: 'es_PE',
            charset: 'iso-8859-1',
            name: 'Español: Perú'
        },{
            lingua: 'es_PR',
            charset: 'iso-8859-1',
            name: 'Español: Puerto Rico'
        },{
            lingua: 'es_PY',
            charset: 'iso-8859-1',
            name: 'Español: Paraguay'
        },{
            lingua: 'es_SV',
            charset: 'iso-8859-1',
            name: 'Español: El Salvador'
        },{
            lingua: 'es_UY',
            charset: 'iso-8859-1',
            name: 'Español: Uruguay'
        },{
            lingua: 'es_VE',
            charset: 'iso-8859-1',
            name: 'Español: Venezuela'
        },{
            lingua: 'fr_BE',
            charset: 'utf-8',
            name: 'Français: Belgique'
        },{
            lingua: 'fr_CA',
            charset: 'utf-8',
            name: 'Français: Canada'
        },{
            lingua: 'fr_CH',
            charset: 'utf-8',
            name: 'Français: La Suisse'
        },{
            lingua: 'fr_FR',
            charset: 'utf-8',
            name: 'Français: France'
        },{
            lingua: 'fr_LU',
            charset: 'utf-8',
            name: 'Français: Luxembourg'
        },{
            lingua: 'he_IL',
            charset: 'utf-8',
            name: 'ʿIvrit: ישראל'
        },{
            lingua: 'hu_HU',
            charset: 'utf-8',
            charaff: 'unknown-8bit',
            name: 'Magyar: Magyarország'
        },{
            lingua: 'it_CH',
            charset: 'iso-8859-1',
            name: 'Italiana: Svizzera'
        },{
            lingua: 'it_IT',
            charset: 'iso-8859-1',
            name: 'Italiana: Italia'
        },{
            lingua: 'la_ANY',
            charset: 'us-ascii',
            charaff: 'iso-8859-1',
            name: 'Latīna: INTL'
        },{
            lingua: 'nl_AW',
            charset: 'utf-8',
            name: 'Nederlands: Aruba'
        },{
            lingua: 'nl_BE',
            charset: 'utf-8',
            name: 'Nederlands: België'
        },{
            lingua: 'nl_NL',
            charset: 'utf-8',
            name: 'Nederlands: Nederland'
        },{
            lingua: 'pl_PL',
            charset: 'iso-8859-1',
            name: 'Polszczyzna: Polska'
        },{
            lingua: 'ro_RO',
            charset: 'utf-8',
            name: 'Română: România'
        },{
            lingua: 'ru_RU',
            charset: 'iso-8859-1',
            name: 'Русский: Россия'
        },{
            lingua: 'tr_TR',
            charset: 'utf-8',
            name: 'Türkçe: Türkiye'
        }]
    },

    queryMode: 'local',
    displayField: 'name',
    valueField: 'lingua',
    emptyText: 'Language ..',
    width: 256
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
