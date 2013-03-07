Ext.define ('Webed.store.Linguas', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Lingua',
    model: 'Webed.model.Lingua',

    data: [{
        lingua: 'af_ZA',
        charset: 'utf-8',
        name: 'Afrikaans',
        country: 'Suid-Afrika',
        icon: 'icon-flag_south_africa'
    },{
        lingua: 'ar_ANY',
        charset: 'utf-8',
        name: 'Al-ʻarabīyah',
        country: 'دولي',
        direction: 'rtl'
    },{
        lingua: 'az_AZ',
        charset: 'utf-8',
        name: 'Azərbaycanca',
        country: 'Azərbaycan',
        icon: 'icon-flag_azerbaijan'
    },{
        lingua: 'be_BY',
        charset: 'utf-8',
        name: 'Беларускія',
        country: 'Беларусь',
        icon: 'icon-flag_belarus'
    },{
        lingua: 'bg_BG',
        charset: 'utf-8',
        name: 'български',
        country: 'България',
        icon: 'icon-flag_bulgaria'
    },{
        lingua: 'bn_BD',
        charset: 'utf-8',
        name: 'বাঙ্গালী',
        country: 'বাংলাদেশ',
        icon: 'icon-flag_bangladesh'
    },{
        lingua: 'cs_CZ',
        charset: 'utf-8',
        name: 'Český',
        country: 'Česká republika',
        icon: 'icon-flag_czech_republic'
    },{
        lingua: 'de_AT',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Österreich',
        icon: 'icon-flag_austria'
    },{
        lingua: 'da_DK',
        charset: 'utf-8',
        name: 'Dansk',
        country: 'Danmark',
        icon: 'icon-flag_denmark',
        flag: {hidden: true}
    },{
        lingua: 'de_BE',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Belgien',
        icon: 'icon-flag_belgium'
    },{
        lingua: 'de_CH',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Schweiz',
        icon: 'icon-flag_switzerland'
    },{
        lingua: 'de_DE',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Deutschland',
        icon: 'icon-flag_germany'
    },{
        lingua: 'de_LI',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Liechtenstein',
        icon: 'icon-flag_liechtenstein'
    },{
        lingua: 'de_LU',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Luxemburg',
        icon: 'icon-flag_luxembourg'
    },{
        lingua: 'el_GR',
        charset: 'utf-8',
        name: 'Eλληνικά',
        country: 'Ελλάδα',
        icon: 'icon-flag_greece'
    },{
        lingua: 'en_AG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Antigua And Barbuda',
        icon: 'icon-flag_antigua_and_barbuda'
    },{
        lingua: 'en_AU',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Australia',
        icon: 'icon-flag_australia'
    },{
        lingua: 'en_BS',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Bahamas',
        icon: 'icon-flag_bahamas'
    },{
        lingua: 'en_BW',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Botswana',
        icon: 'icon-flag_botswana'
    },{
        lingua: 'en_BZ',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Belize',
        icon: 'icon-flag_belize'
    },{
        lingua: 'en_CA',
        charset: 'us-ascii',
        name: 'English',
        country: 'Canada',
        icon: 'icon-flag_canada'
    },{
        lingua: 'en_DK',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Denmark',
        icon: 'icon-flag_denmark'
    },{
        lingua: 'en_GB',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'United Kingdom',
        icon: 'icon-flag_great_britain'
    },{
        lingua: 'en_GH',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Ghana',
        icon: 'icon-flag_ghana'
    },{
        lingua: 'en_HK',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Hong Kong',
        icon: 'icon-flag_hong_kong'
    },{
        lingua: 'en_IE',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Ireland',
        icon: 'icon-flag_ireland'
    },{
        lingua: 'en_IN',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'India',
        icon: 'icon-flag_india'
    },{
        lingua: 'en_JM',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Jamaica',
        icon: 'icon-flag_jamaica'
    },{
        lingua: 'en_NA',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Namibia',
        icon: 'icon-flag_namibia'
    },{
        lingua: 'en_NG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Nigeria',
        icon: 'icon-flag_nigeria'
    },{
        lingua: 'en_NZ',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'New Zealand',
        icon: 'icon-flag_new_zealand'
    },{
        lingua: 'en_PH',
        charset: 'us-ascii',
        name: 'English',
        country: 'Philippines',
        icon: 'icon-flag_philippines'
    },{
        lingua: 'en_SG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Singapore',
        icon: 'icon-flag_singapore'
    },{
        lingua: 'en_TT',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Trinidad And Tobago',
        icon: 'icon-flag_trinidad_and_tobago'
    },{
        lingua: 'en_US',
        charset: 'us-ascii',
        name: 'English',
        country: 'United States',
        icon: 'icon-flag_usa'
    },{
        lingua: 'en_ZA',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'South Africa',
        icon: 'icon-flag_south_africa'
    },{
        lingua: 'en_ZW',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Zimbabwe',
        icon: 'icon-flag_zimbabwe'
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
        icon: 'icon-flag_argentina'
    },{
        lingua: 'es_BO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Bolivia',
        icon: 'icon-flag_bolivia'
    },{
        lingua: 'es_CL',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Chile',
        icon: 'icon-flag_chile'
    },{
        lingua: 'es_CO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Colombia',
        icon: 'icon-flag_colombia'
    },{
        lingua: 'es_CR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Costa Rica',
        icon: 'icon-flag_costa_rica'
    },{
        lingua: 'es_CU',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Cuba',
        icon: 'icon-flag_cuba'
    },{
        lingua: 'es_DO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'La República Dominicana',
        icon: 'icon-flag_dominican_republic'
    },{
        lingua: 'es_EC',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Ecuador',
        icon: 'icon-flag_equador'
    },{
        lingua: 'es_ES',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'España',
        icon: 'icon-flag_spain'
    },{
        lingua: 'es_GT',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Guatemala',
        icon: 'icon-flag_guatemala'
    },{
        lingua: 'es_HN',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Honduras',
        icon: 'icon-flag_honduras'
    },{
        lingua: 'es_MX',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'México',
        icon: 'icon-flag_mexico'
    },{
        lingua: 'es_NI',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Nicaragua',
        icon: 'icon-flag_nicaragua'
    },{
        lingua: 'es_PA',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Panamá',
        icon: 'icon-flag_panama'
    },{
        lingua: 'es_PE',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Perú',
        icon: 'icon-flag_peru'
    },{
        lingua: 'es_PR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Puerto Rico',
        icon: 'icon-flag_puerto_rico'
    },{
        lingua: 'es_PY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Paraguay',
        icon: 'icon-flag_paraquay'
    },{
        lingua: 'es_SV',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'El Salvador',
        icon: 'icon-flag_el_salvador'
    },{
        lingua: 'es_UY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Uruguay',
        icon: 'icon-flag_uruquay'
    },{
        lingua: 'es_VE',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Venezuela',
        icon: 'icon-flag_venezuela'
    },{
        lingua: 'fa_IR',
        charset: 'utf-8',
        name: 'Fārsi',
        country: 'ایران',
        icon: 'icon-flag_iran',
        direction: 'rtl'
    },{
        lingua: 'fr_BE',
        charset: 'utf-8',
        name: 'Français',
        country: 'Belgique',
        icon: 'icon-flag_belgium'
    },{
        lingua: 'fr_CA',
        charset: 'utf-8',
        name: 'Français',
        country: 'Canada',
        icon: 'icon-flag_canada'
    },{
        lingua: 'fr_CH',
        charset: 'utf-8',
        name: 'Français',
        country: 'La Suisse',
        icon: 'icon-flag_switzerland'
    },{
        lingua: 'fr_FR',
        charset: 'utf-8',
        name: 'Français',
        country: 'France',
        icon: 'icon-flag_france'
    },{
        lingua: 'fr_LU',
        charset: 'utf-8',
        name: 'Français',
        country: 'Luxembourg',
        icon: 'icon-flag_luxembourg'
    },{
        lingua: 'gd_GB',
        charset: 'utf-8',
        name: 'Gàidhlig',
        country: 'Alba',
        icon: 'icon-flag_scotland'
    },{
        lingua: 'gu_IN',
        charset: 'utf-8',
        name: 'ગુજરાતી',
        country: 'ભારત',
        icon: 'icon-flag_india',
        flag: {hidden: true}
    },{
        lingua: 'he_IL',
        charset: 'utf-8',
        name: 'ʿIvrit',
        country: 'ישראל',
        icon: 'icon-flag_israel',
        direction: 'rtl',
        flag: {hidden: true}
    },{
        lingua: 'hi_IN',
        charset: 'utf-8',
        name: 'हिंदी',
        country: 'भारत',
        icon: 'icon-flag_india',
        flag: {hidden: true}
    },{
        lingua: 'hr_HR',
        charset: 'utf-8',
        name: 'Hrvatski',
        country: 'Hrvatska',
        icon: 'icon-flag_croatia'
    },{
        lingua: 'hu_HU',
        charset: 'utf-8',
        name: 'Magyar',
        country: 'Magyarország',
        icon: 'icon-flag_hungary',
        flag: {hidden: true}
    },{
        lingua: 'hy_AM',
        charset: 'utf-8',
        name: 'հայերեն',
        country: 'Հայաստան',
        icon: 'icon-flag_armenia',
        flag: {hidden: true}
    },{
        lingua: 'id_ID',
        charset: 'iso-8859-1',
        name: 'Bahasa Indonesia',
        country: 'Indonesia',
        icon: 'icon-flag_indonesia'
    },{
        lingua: 'is_IS',
        charset: 'utf-8',
        name: 'Íslenska',
        country: 'Ísland',
        icon: 'icon-flag_iceland'
    },{
        lingua: 'it_CH',
        charset: 'utf-8',
        name: 'Italiana',
        country: 'Svizzera',
        icon: 'icon-flag_switzerland',
        flag: {hidden: true}
    },{
        lingua: 'it_IT',
        charset: 'utf-8',
        name: 'Italiana',
        country: 'Italia',
        icon: 'icon-flag_italy',
        flag: {hidden: true}
    },{
        lingua: 'kk_KZ',
        charset: 'utf-8',
        name: 'Қазақ',
        country: 'Қазақстан',
        icon: 'icon-flag_kazakhstan',
        flag: {hidden: true}
    },{
        lingua: 'ko_NKR',
        charset: 'utf-8',
        name: '조선어',
        country: '조선민주주의인민공화국',
        icon: 'icon-flag_north_korea',
        flag: {hidden: true}
    },{
        lingua: 'ko_SKR',
        charset: 'utf-8',
        name: '한국어',
        country: '대한민국',
        icon: 'icon-flag_south_korea',
        flag: {hidden: true}
    },{
        lingua: 'ku_TR',
        charset: 'utf-8',
        name: 'Kurdî',
        country: 'Tirkiya',
        icon: 'icon-flag_turkey',
        flag: {hidden: true}
    },{
        lingua: 'la_ANY',
        charset: 'utf-8',
        name: 'Latīna',
        country: 'International',
        flag: {hidden: true}
    },{
        lingua: 'lt_LT',
        charset: 'utf-8',
        name: 'Lietuvių',
        country: 'Lietuva',
        icon: 'icon-flag_lithuania',
        flag: {hidden: true}
    },{
        lingua: 'lv_LV',
        charset: 'utf-8',
        name: 'Latviešu',
        country: 'Latvija',
        icon: 'icon-flag_latvia',
        flag: {hidden: true}
    },{
        lingua: 'ml_IN',
        charset: 'utf-8',
        name: 'മലയാളം',
        country: 'ഇന്ത്യ',
        icon: 'icon-flag_india',
        flag: {hidden: true}
    },{
        lingua: 'mn_MN',
        charset: 'utf-8',
        name: 'Монгол хэл',
        country: 'Монгол улс',
        icon: 'icon-flag_mongolia'
    },{
        lingua: 'mr_IN',
        charset: 'utf-8',
        name: 'मराठी',
        country: 'इंडिया',
        icon: 'icon-flag_india',
        flag: {hidden: true}
    },{
        lingua: 'ne_NP',
        charset: 'utf-8',
        name: 'नेपाली',
        country: 'नेपाल',
        icon: 'icon-flag_nepal',
        flag: {hidden: true}
    },{
        lingua: 'nb_NO',
        charset: 'utf-8',
        name: 'Bokmål',
        country: 'Norge',
        icon: 'icon-flag_norway'
    },{
        lingua: 'nl_NL',
        charset: 'utf-8',
        name: 'Nederlands',
        country: 'Nederland',
        icon: 'icon-flag_netherlands'
    },{
        lingua: 'nn_NO',
        charset: 'utf-8',
        name: 'Nynorsk',
        country: 'Norge',
        icon: 'icon-flag_norway'
    },{
        lingua: 'pa_IN',
        charset: 'utf-8',
        name: 'ਪੰਜਾਬੀ',
        country: 'ਇੰਡੀਆ',
        icon: 'icon-flag_india',
        flag: {hidden: true}
    },{
        lingua: 'pl_PL',
        charset: 'iso-8859-1',
        name: 'Polszczyzna',
        country: 'Polska',
        icon: 'icon-flag_poland'
    },{
        lingua: 'pt_BR',
        charset: 'utf-8',
        name: 'Português',
        country: 'Brasil',
        icon: 'icon-flag_brazil',
        flag: {hidden: true}
    },{
        lingua: 'pt_PT',
        charset: 'utf-8',
        name: 'Português',
        country: 'Portugal',
        icon: 'icon-flag_portugal',
        flag: {hidden: true}
    },{
        lingua: 'ro_RO',
        charset: 'utf-8',
        name: 'Română',
        country: 'România',
        icon: 'icon-flag_romania'
    },{
        lingua: 'ru_RU',
        charset: 'utf-8',
        name: 'Русский',
        country: 'Россия',
        icon: 'icon-flag_russia'
    },{
        lingua: 'sk_SK',
        charset: 'utf-8',
        name: 'Slovenčina',
        country: 'Slovensko',
        icon: 'icon-flag_slovakia'
    },{
        lingua: 'sl_SI',
        charset: 'utf-8',
        name: 'Slovenski',
        country: 'Slovenija',
        icon: 'icon-flag_slovenia'
    },{
        lingua: 'sr_LA',
        charset: 'utf-8',
        name: 'Serbian',
        country: 'Serbian',
        icon: 'icon-flag_serbia_montenegro'
    },{
        lingua: 'sr_SR',
        charset: 'utf-8',
        name: 'Cрпски',
        country: 'Србија',
        icon: 'icon-flag_serbia_montenegro'
    },{
        lingua: 'sv_FI',
        charset: 'utf-8',
        name: 'Svenska',
        country: 'Finland',
        icon: 'icon-flag_finland'
    },{
        lingua: 'sv_SE',
        charset: 'utf-8',
        name: 'Svenska',
        country: 'Sverige',
        icon: 'icon-flag_sweden'
    },{
        lingua: 'sq_AL',
        charset: 'utf-8',
        name: 'Shqip',
        country: 'Shqipëri',
        icon: 'icon-flag_albania'
    },{
        lingua: 'sw_KE',
        charset: 'iso-8859-1',
        name: 'Kiswahili',
        country: 'Kenya',
        icon: 'icon-flag_kenya'
    },{
        lingua: 'sw_TZ',
        charset: 'iso-8859-1',
        name: 'Kiswahili',
        country: 'Tanzania',
        icon: 'icon-flag_tanzania'
    },{
        lingua: 'ta_ANY',
        charset: 'utf-8',
        name: 'தமிழ்',
        country: 'சர்வதேச',
        flag: {hidden: true}
    },{
        lingua: 'tr_TR',
        charset: 'utf-8',
        name: 'Türkçe',
        country: 'Türkiye',
        icon: 'icon-flag_turkey'
    },{
        lingua: 'uk_UA',
        charset: 'utf-8',
        name: 'украї́нська',
        country: 'Україна',
        icon: 'icon-flag_ukraine'
    },{
        lingua: 'ur_PK',
        charset: 'utf-8',
        name: 'Urdu',
        country: 'پاكِستان',
        icon: 'icon-flag_pakistan',
        direction: 'rtl'
    },{
        lingua: 'vi_VN',
        charset: 'utf-8',
        name: 'Tiếng Việt',
        country: 'Việt Nam',
        icon: 'icon-flag_vietnam'
    }]
});
