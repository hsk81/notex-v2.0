Ext.define ('Webed.store.Linguas', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Lingua',
    model: 'Webed.model.Lingua',

    data: [{
        lingua: 'ar_ANY',
        charset: 'utf-8',
        name: 'Al-ʻarabīyah',
        country: 'دولي'
    },{
        lingua: 'bg_BG',
        charset: 'utf-8',
        name: 'български',
        country: 'България',
        flag: 'flag_bulgaria'
    },{
        lingua: 'cs_CZ',
        charset: 'utf-8',
        name: 'Český',
        country: 'Česká republika',
        flag: 'flag_czech_republic'
    },{
        lingua: 'de_AT',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Österreich',
        flag: 'flag_austria'
    },{
        lingua: 'da_DK',
        charset: 'utf-8',
        name: 'Dansk',
        country: 'Danmark',
        flag: 'flag_denmark',
        disabled: true
    },{
        lingua: 'de_BE',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Belgien',
        flag: 'flag_belgium'
    },{
        lingua: 'de_CH',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Schweiz',
        flag: 'flag_switzerland'
    },{
        lingua: 'de_DE',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Deutschland',
        flag: 'flag_germany'
    },{
        lingua: 'de_LI',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Liechtenstein',
        flag: 'flag_liechtenstein'
    },{
        lingua: 'de_LU',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Luxemburg',
        flag: 'flag_luxembourg'
    },{
        lingua: 'el_GR',
        charset: 'utf-8',
        name: 'Eλληνικά',
        country: 'Ελλάδα',
        flag: 'flag_greece'
    },{
        lingua: 'en_AG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Antigua And Barbuda',
        flag: 'flag_antigua_and_barbuda'
    },{
        lingua: 'en_AU',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Australia',
        flag: 'flag_australia'
    },{
        lingua: 'en_BS',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Bahamas',
        flag: 'flag_bahamas'
    },{
        lingua: 'en_BW',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Botswana',
        flag: 'flag_botswana'
    },{
        lingua: 'en_BZ',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Belize',
        flag: 'flag_belize'
    },{
        lingua: 'en_CA',
        charset: 'us-ascii',
        name: 'English',
        country: 'Canada',
        flag: 'flag_canada'
    },{
        lingua: 'en_DK',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Denmark',
        flag: 'flag_denmark'
    },{
        lingua: 'en_GB',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'United Kingdom',
        flag: 'flag_great_britain'
    },{
        lingua: 'en_GH',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Ghana',
        flag: 'flag_ghana'
    },{
        lingua: 'en_HK',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Hong Kong',
        flag: 'flag_hong_kong'
    },{
        lingua: 'en_IE',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Ireland',
        flag: 'flag_ireland'
    },{
        lingua: 'en_IN',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'India',
        flag: 'flag_india'
    },{
        lingua: 'en_JM',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Jamaica',
        flag: 'flag_jamaica'
    },{
        lingua: 'en_NA',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Namibia',
        flag: 'flag_namibia'
    },{
        lingua: 'en_NG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Nigeria',
        flag: 'flag_nigeria'
    },{
        lingua: 'en_NZ',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'New Zealand',
        flag: 'flag_new_zealand'
    },{
        lingua: 'en_PH',
        charset: 'us-ascii',
        name: 'English',
        country: 'Philippines',
        flag: 'flag_philippines'
    },{
        lingua: 'en_SG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Singapore',
        flag: 'flag_singapore'
    },{
        lingua: 'en_TT',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Trinidad And Tobago',
        flag: 'flag_trinidad_and_tobago'
    },{
        lingua: 'en_US',
        charset: 'us-ascii',
        name: 'English',
        country: 'United States',
        flag: 'flag_usa'
    },{
        lingua: 'en_ZA',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'South Africa',
        flag: 'flag_south_africa'
    },{
        lingua: 'en_ZW',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Zimbabwe',
        flag: 'flag_zimbabwe'
    },{
        lingua: 'es_ANY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Internacional'
    },{
        lingua: 'es_AR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Argentina',
        flag: 'flag_argentina'
    },{
        lingua: 'es_BO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Bolivia',
        flag: 'flag_bolivia'
    },{
        lingua: 'es_CL',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Chile',
        flag: 'flag_chile'
    },{
        lingua: 'es_CO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Colombia',
        flag: 'flag_colombia'
    },{
        lingua: 'es_CR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Costa Rica',
        flag: 'flag_costa_rica'
    },{
        lingua: 'es_CU',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Cuba',
        flag: 'flag_cuba'
    },{
        lingua: 'es_DO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'La República Dominicana',
        flag: 'flag_dominican_republic'
    },{
        lingua: 'es_EC',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Ecuador',
        flag: 'flag_equador'
    },{
        lingua: 'es_ES',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'España',
        flag: 'flag_spain'
    },{
        lingua: 'es_GT',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Guatemala',
        flag: 'flag_guatemala'
    },{
        lingua: 'es_HN',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Honduras',
        flag: 'flag_honduras'
    },{
        lingua: 'es_MX',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'México',
        flag: 'flag_mexico'
    },{
        lingua: 'es_NI',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Nicaragua',
        flag: 'flag_nicaragua'
    },{
        lingua: 'es_PA',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Panamá',
        flag: 'flag_panama'
    },{
        lingua: 'es_PE',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Perú',
        flag: 'flag_peru'
    },{
        lingua: 'es_PR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Puerto Rico',
        flag: 'flag_puerto_rico'
    },{
        lingua: 'es_PY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Paraguay',
        flag: 'flag_paraquay'
    },{
        lingua: 'es_SV',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'El Salvador',
        flag: 'flag_el_salvador'
    },{
        lingua: 'es_UY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Uruguay',
        flag: 'flag_uruquay'
    },{
        lingua: 'es_VE',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Venezuela',
        flag: 'flag_venezuela'
    },{
        lingua: 'fr_BE',
        charset: 'utf-8',
        name: 'Français',
        country: 'Belgique',
        flag: 'flag_belgium'
    },{
        lingua: 'fr_CA',
        charset: 'utf-8',
        name: 'Français',
        country: 'Canada',
        flag: 'flag_canada'
    },{
        lingua: 'fr_CH',
        charset: 'utf-8',
        name: 'Français',
        country: 'La Suisse',
        flag: 'flag_switzerland'
    },{
        lingua: 'fr_FR',
        charset: 'utf-8',
        name: 'Français',
        country: 'France',
        flag: 'flag_france'
    },{
        lingua: 'fr_LU',
        charset: 'utf-8',
        name: 'Français',
        country: 'Luxembourg',
        flag: 'flag_luxembourg'
    },{
        lingua: 'he_IL',
        charset: 'utf-8',
        name: 'ʿIvrit',
        country: 'ישראל',
        flag: 'flag_israel',
        disabled: true
    },{
        lingua: 'hr_HR',
        charset: 'utf-8',
        name: 'Hrvatski',
        country: 'Hrvatska',
        flag: 'flag_croatia'
    },{
        lingua: 'hu_HU',
        charset: 'utf-8',
        name: 'Magyar',
        country: 'Magyarország',
        flag: 'flag_hungary',
        disabled: true
    },{
        lingua: 'it_CH',
        charset: 'iso-8859-1',
        name: 'Italiana',
        country: 'Svizzera',
        flag: 'flag_switzerland',
        disabled: true
    },{
        lingua: 'it_IT',
        charset: 'iso-8859-1',
        name: 'Italiana',
        country: 'Italia',
        flag: 'flag_italy',
        disabled: true
    },{
        lingua: 'ko_NKR',
        charset: 'utf-8',
        name: '한국의',
        country: '북한',
        flag: 'flag_north_korea',
        disabled: true
    },{
        lingua: 'kk_KZ',
        charset: 'utf-8',
        name: 'Қазақ',
        country: 'Қазақстан',
        flag: 'flag_kazakhstan',
        disabled: true
    },{
        lingua: 'ko_SKR',
        charset: 'utf-8',
        name: '한국의',
        country: '대한민국',
        flag: 'flag_south_korea',
        disabled: true
    },{
        lingua: 'la_ANY',
        charset: 'utf-8',
        name: 'Latīna',
        country: 'International',
        disabled: true
    },{
        lingua: 'lt_LT',
        charset: 'utf-8',
        name: 'Lietuviešu',
        country: 'Lietuva',
        flag: 'flag_lithuania',
        disabled: true
    },{
        lingua: 'lv_LV',
        charset: 'utf-8',
        name: 'Latvijos',
        country: 'Latvija',
        flag: 'flag_latvia',
        disabled: true
    },{
        lingua: 'nl_AW',
        charset: 'utf-8',
        name: 'Nederlands',
        country: 'Aruba',
        flag: 'flag_aruba',
        disabled: true
    },{
        lingua: 'nl_BE',
        charset: 'utf-8',
        name: 'Nederlands',
        country: 'België',
        flag: 'flag_belgium',
        disabled: true
    },{
        lingua: 'nl_NL',
        charset: 'utf-8',
        name: 'Nederlands',
        country: 'Nederland',
        flag: 'flag_netherlands',
        disabled: true
    },{
        lingua: 'pl_PL',
        charset: 'iso-8859-1',
        name: 'Polszczyzna',
        country: 'Polska',
        flag: 'flag_poland'
    },{
        lingua: 'pt_BR',
        charset: 'utf-8',
        name: 'Português',
        country: 'Brasil',
        flag: 'flag_brazil',
        disabled: true
    },{
        lingua: 'pt_PT',
        charset: 'utf-8',
        name: 'Português',
        country: 'Portugal',
        flag: 'flag_portugal',
        disabled: true
    },{
        lingua: 'ro_RO',
        charset: 'utf-8',
        name: 'Română',
        country: 'România',
        flag: 'flag_romania'
    },{
        lingua: 'ru_RU',
        charset: 'utf-8',
        name: 'Русский',
        country: 'Россия',
        flag: 'flag_russia'
    },{
        lingua: 'sk_SK',
        charset: 'utf-8',
        name: 'Slovenčina',
        country: 'Slovensko',
        flag: 'flag_slovakia'
    },{
        lingua: 'sl_SI',
        charset: 'utf-8',
        name: 'Slovenski',
        country: 'Slovenija',
        flag: 'flag_slovenia'
    },{
        lingua: 'sr_LA',
        charset: 'utf-8',
        name: 'Serbian',
        country: 'Serbian',
        flag: 'flag_serbia_montenegro'
    },{
        lingua: 'sr_SR',
        charset: 'utf-8',
        name: 'Cрпски',
        country: 'Србија',
        flag: 'flag_serbia_montenegro'
    },{
        lingua: 'sv_FI',
        charset: 'utf-8',
        name: 'Svenska',
        country: 'Finland',
        flag: 'flag_finland'
    },{
        lingua: 'sv_SE',
        charset: 'utf-8',
        name: 'Svenska',
        country: 'Sverige',
        flag: 'flag_sweden'
    },{
        lingua: 'tr_TR',
        charset: 'utf-8',
        name: 'Türkçe',
        country: 'Türkiye',
        flag: 'flag_turkey'
    },{
        lingua: 'uk_UA',
        charset: 'utf-8',
        name: 'украї́нська',
        country: 'Україна',
        flag: 'flag_ukraine'
    }]
});
