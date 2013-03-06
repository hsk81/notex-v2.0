Ext.define ('Webed.store.Linguas', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.Lingua',
    model: 'Webed.model.Lingua',

    data: [{
        lingua: 'af_ZA',
        charset: 'utf-8',
        name: 'Afrikaans',
        country: 'Suid-Afrika',
        flag: 'icon-flag_south_africa'
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
        flag: 'icon-flag_azerbaijan'
    },{
        lingua: 'be_BY',
        charset: 'utf-8',
        name: 'Беларускія',
        country: 'Беларусь',
        flag: 'icon-flag_belarus'
    },{
        lingua: 'bg_BG',
        charset: 'utf-8',
        name: 'български',
        country: 'България',
        flag: 'icon-flag_bulgaria'
    },{
        lingua: 'bn_BD',
        charset: 'utf-8',
        name: 'বাঙ্গালী',
        country: 'বাংলাদেশ',
        flag: 'icon-flag_bangladesh'
    },{
        lingua: 'cs_CZ',
        charset: 'utf-8',
        name: 'Český',
        country: 'Česká republika',
        flag: 'icon-flag_czech_republic'
    },{
        lingua: 'de_AT',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Österreich',
        flag: 'icon-flag_austria'
    },{
        lingua: 'da_DK',
        charset: 'utf-8',
        name: 'Dansk',
        country: 'Danmark',
        flag: 'icon-flag_denmark',
        hidden: true
    },{
        lingua: 'de_BE',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Belgien',
        flag: 'icon-flag_belgium'
    },{
        lingua: 'de_CH',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Schweiz',
        flag: 'icon-flag_switzerland'
    },{
        lingua: 'de_DE',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Deutschland',
        flag: 'icon-flag_germany'
    },{
        lingua: 'de_LI',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Liechtenstein',
        flag: 'icon-flag_liechtenstein'
    },{
        lingua: 'de_LU',
        charset: 'iso-8859-1',
        name: 'Deutsch',
        country: 'Luxemburg',
        flag: 'icon-flag_luxembourg'
    },{
        lingua: 'el_GR',
        charset: 'utf-8',
        name: 'Eλληνικά',
        country: 'Ελλάδα',
        flag: 'icon-flag_greece'
    },{
        lingua: 'en_AG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Antigua And Barbuda',
        flag: 'icon-flag_antigua_and_barbuda'
    },{
        lingua: 'en_AU',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Australia',
        flag: 'icon-flag_australia'
    },{
        lingua: 'en_BS',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Bahamas',
        flag: 'icon-flag_bahamas'
    },{
        lingua: 'en_BW',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Botswana',
        flag: 'icon-flag_botswana'
    },{
        lingua: 'en_BZ',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Belize',
        flag: 'icon-flag_belize'
    },{
        lingua: 'en_CA',
        charset: 'us-ascii',
        name: 'English',
        country: 'Canada',
        flag: 'icon-flag_canada'
    },{
        lingua: 'en_DK',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Denmark',
        flag: 'icon-flag_denmark'
    },{
        lingua: 'en_GB',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'United Kingdom',
        flag: 'icon-flag_great_britain'
    },{
        lingua: 'en_GH',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Ghana',
        flag: 'icon-flag_ghana'
    },{
        lingua: 'en_HK',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Hong Kong',
        flag: 'icon-flag_hong_kong'
    },{
        lingua: 'en_IE',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Ireland',
        flag: 'icon-flag_ireland'
    },{
        lingua: 'en_IN',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'India',
        flag: 'icon-flag_india'
    },{
        lingua: 'en_JM',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Jamaica',
        flag: 'icon-flag_jamaica'
    },{
        lingua: 'en_NA',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Namibia',
        flag: 'icon-flag_namibia'
    },{
        lingua: 'en_NG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Nigeria',
        flag: 'icon-flag_nigeria'
    },{
        lingua: 'en_NZ',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'New Zealand',
        flag: 'icon-flag_new_zealand'
    },{
        lingua: 'en_PH',
        charset: 'us-ascii',
        name: 'English',
        country: 'Philippines',
        flag: 'icon-flag_philippines'
    },{
        lingua: 'en_SG',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Singapore',
        flag: 'icon-flag_singapore'
    },{
        lingua: 'en_TT',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Trinidad And Tobago',
        flag: 'icon-flag_trinidad_and_tobago'
    },{
        lingua: 'en_US',
        charset: 'us-ascii',
        name: 'English',
        country: 'United States',
        flag: 'icon-flag_usa'
    },{
        lingua: 'en_ZA',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'South Africa',
        flag: 'icon-flag_south_africa'
    },{
        lingua: 'en_ZW',
        charset: 'iso-8859-1',
        name: 'English',
        country: 'Zimbabwe',
        flag: 'icon-flag_zimbabwe'
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
        flag: 'icon-flag_argentina'
    },{
        lingua: 'es_BO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Bolivia',
        flag: 'icon-flag_bolivia'
    },{
        lingua: 'es_CL',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Chile',
        flag: 'icon-flag_chile'
    },{
        lingua: 'es_CO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Colombia',
        flag: 'icon-flag_colombia'
    },{
        lingua: 'es_CR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Costa Rica',
        flag: 'icon-flag_costa_rica'
    },{
        lingua: 'es_CU',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Cuba',
        flag: 'icon-flag_cuba'
    },{
        lingua: 'es_DO',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'La República Dominicana',
        flag: 'icon-flag_dominican_republic'
    },{
        lingua: 'es_EC',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Ecuador',
        flag: 'icon-flag_equador'
    },{
        lingua: 'es_ES',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'España',
        flag: 'icon-flag_spain'
    },{
        lingua: 'es_GT',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Guatemala',
        flag: 'icon-flag_guatemala'
    },{
        lingua: 'es_HN',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Honduras',
        flag: 'icon-flag_honduras'
    },{
        lingua: 'es_MX',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'México',
        flag: 'icon-flag_mexico'
    },{
        lingua: 'es_NI',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Nicaragua',
        flag: 'icon-flag_nicaragua'
    },{
        lingua: 'es_PA',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Panamá',
        flag: 'icon-flag_panama'
    },{
        lingua: 'es_PE',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Perú',
        flag: 'icon-flag_peru'
    },{
        lingua: 'es_PR',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Puerto Rico',
        flag: 'icon-flag_puerto_rico'
    },{
        lingua: 'es_PY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Paraguay',
        flag: 'icon-flag_paraquay'
    },{
        lingua: 'es_SV',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'El Salvador',
        flag: 'icon-flag_el_salvador'
    },{
        lingua: 'es_UY',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Uruguay',
        flag: 'icon-flag_uruquay'
    },{
        lingua: 'es_VE',
        charset: 'iso-8859-1',
        name: 'Español',
        country: 'Venezuela',
        flag: 'icon-flag_venezuela'
    },{
        lingua: 'fa_IR',
        charset: 'utf-8',
        name: 'Fārsi',
        country: 'ایران',
        flag: 'icon-flag_iran',
        direction: 'rtl'
    },{
        lingua: 'fr_BE',
        charset: 'utf-8',
        name: 'Français',
        country: 'Belgique',
        flag: 'icon-flag_belgium'
    },{
        lingua: 'fr_CA',
        charset: 'utf-8',
        name: 'Français',
        country: 'Canada',
        flag: 'icon-flag_canada'
    },{
        lingua: 'fr_CH',
        charset: 'utf-8',
        name: 'Français',
        country: 'La Suisse',
        flag: 'icon-flag_switzerland'
    },{
        lingua: 'fr_FR',
        charset: 'utf-8',
        name: 'Français',
        country: 'France',
        flag: 'icon-flag_france'
    },{
        lingua: 'fr_LU',
        charset: 'utf-8',
        name: 'Français',
        country: 'Luxembourg',
        flag: 'icon-flag_luxembourg'
    },{
        lingua: 'gd_GB',
        charset: 'utf-8',
        name: 'Gàidhlig',
        country: 'Alba',
        flag: 'icon-flag_scotland'
    },{
        lingua: 'gu_IN',
        charset: 'utf-8',
        name: 'ગુજરાતી',
        country: 'ભારત',
        flag: 'icon-flag_india',
        hidden: true
    },{
        lingua: 'he_IL',
        charset: 'utf-8',
        name: 'ʿIvrit',
        country: 'ישראל',
        flag: 'icon-flag_israel',
        direction: 'rtl',
        hidden: true
    },{
        lingua: 'hi_IN',
        charset: 'utf-8',
        name: 'हिंदी',
        country: 'भारत',
        flag: 'icon-flag_india',
        hidden: true
    },{
        lingua: 'hr_HR',
        charset: 'utf-8',
        name: 'Hrvatski',
        country: 'Hrvatska',
        flag: 'icon-flag_croatia'
    },{
        lingua: 'hu_HU',
        charset: 'utf-8',
        name: 'Magyar',
        country: 'Magyarország',
        flag: 'icon-flag_hungary',
        hidden: true
    },{
        lingua: 'hy_AM',
        charset: 'utf-8',
        name: 'հայերեն',
        country: 'Հայաստան',
        flag: 'icon-flag_armenia',
        hidden: true
    },{
        lingua: 'id_ID',
        charset: 'iso-8859-1',
        name: 'Bahasa Indonesia',
        country: 'Indonesia',
        flag: 'icon-flag_indonesia'
    },{
        lingua: 'is_IS',
        charset: 'utf-8',
        name: 'Íslenska',
        country: 'Ísland',
        flag: 'icon-flag_iceland'
    },{
        lingua: 'it_CH',
        charset: 'utf-8',
        name: 'Italiana',
        country: 'Svizzera',
        flag: 'icon-flag_switzerland',
        hidden: true
    },{
        lingua: 'it_IT',
        charset: 'utf-8',
        name: 'Italiana',
        country: 'Italia',
        flag: 'icon-flag_italy',
        hidden: true
    },{
        lingua: 'kk_KZ',
        charset: 'utf-8',
        name: 'Қазақ',
        country: 'Қазақстан',
        flag: 'icon-flag_kazakhstan',
        hidden: true
    },{
        lingua: 'ko_NKR',
        charset: 'utf-8',
        name: '조선어',
        country: '조선민주주의인민공화국',
        flag: 'icon-flag_north_korea',
        hidden: true
    },{
        lingua: 'ko_SKR',
        charset: 'utf-8',
        name: '한국어',
        country: '대한민국',
        flag: 'icon-flag_south_korea',
        hidden: true
    },{
        lingua: 'ku_TR',
        charset: 'utf-8',
        name: 'Kurdî',
        country: 'Tirkiya',
        flag: 'icon-flag_turkey',
        hidden: true
    },{
        lingua: 'la_ANY',
        charset: 'utf-8',
        name: 'Latīna',
        country: 'International',
        hidden: true
    },{
        lingua: 'lt_LT',
        charset: 'utf-8',
        name: 'Lietuvių',
        country: 'Lietuva',
        flag: 'icon-flag_lithuania',
        hidden: true
    },{
        lingua: 'lv_LV',
        charset: 'utf-8',
        name: 'Latviešu',
        country: 'Latvija',
        flag: 'icon-flag_latvia',
        hidden: true
    },{
        lingua: 'ml_IN',
        charset: 'utf-8',
        name: 'മലയാളം',
        country: 'ഇന്ത്യ',
        flag: 'icon-flag_india',
        hidden: true
    },{
        lingua: 'mn_MN',
        charset: 'utf-8',
        name: 'Монгол хэл',
        country: 'Монгол улс',
        flag: 'icon-flag_mongolia'
    },{
        lingua: 'mr_IN',
        charset: 'utf-8',
        name: 'मराठी',
        country: 'इंडिया',
        flag: 'icon-flag_india',
        hidden: true
    },{
        lingua: 'ne_NP',
        charset: 'utf-8',
        name: 'नेपाली',
        country: 'नेपाल',
        flag: 'icon-flag_nepal',
        hidden: true
    },{
        lingua: 'nb_NO',
        charset: 'utf-8',
        name: 'Bokmål',
        country: 'Norge',
        flag: 'icon-flag_norway'
    },{
        lingua: 'nl_NL',
        charset: 'utf-8',
        name: 'Nederlands',
        country: 'Nederland',
        flag: 'icon-flag_netherlands'
    },{
        lingua: 'nn_NO',
        charset: 'utf-8',
        name: 'Nynorsk',
        country: 'Norge',
        flag: 'icon-flag_norway'
    },{
        lingua: 'pa_IN',
        charset: 'utf-8',
        name: 'ਪੰਜਾਬੀ',
        country: 'ਇੰਡੀਆ',
        flag: 'icon-flag_india',
        hidden: true
    },{
        lingua: 'pl_PL',
        charset: 'iso-8859-1',
        name: 'Polszczyzna',
        country: 'Polska',
        flag: 'icon-flag_poland'
    },{
        lingua: 'pt_BR',
        charset: 'utf-8',
        name: 'Português',
        country: 'Brasil',
        flag: 'icon-flag_brazil',
        hidden: true
    },{
        lingua: 'pt_PT',
        charset: 'utf-8',
        name: 'Português',
        country: 'Portugal',
        flag: 'icon-flag_portugal',
        hidden: true
    },{
        lingua: 'ro_RO',
        charset: 'utf-8',
        name: 'Română',
        country: 'România',
        flag: 'icon-flag_romania'
    },{
        lingua: 'ru_RU',
        charset: 'utf-8',
        name: 'Русский',
        country: 'Россия',
        flag: 'icon-flag_russia'
    },{
        lingua: 'sk_SK',
        charset: 'utf-8',
        name: 'Slovenčina',
        country: 'Slovensko',
        flag: 'icon-flag_slovakia'
    },{
        lingua: 'sl_SI',
        charset: 'utf-8',
        name: 'Slovenski',
        country: 'Slovenija',
        flag: 'icon-flag_slovenia'
    },{
        lingua: 'sr_LA',
        charset: 'utf-8',
        name: 'Serbian',
        country: 'Serbian',
        flag: 'icon-flag_serbia_montenegro'
    },{
        lingua: 'sr_SR',
        charset: 'utf-8',
        name: 'Cрпски',
        country: 'Србија',
        flag: 'icon-flag_serbia_montenegro'
    },{
        lingua: 'sv_FI',
        charset: 'utf-8',
        name: 'Svenska',
        country: 'Finland',
        flag: 'icon-flag_finland'
    },{
        lingua: 'sv_SE',
        charset: 'utf-8',
        name: 'Svenska',
        country: 'Sverige',
        flag: 'icon-flag_sweden'
    },{
        lingua: 'sq_AL',
        charset: 'utf-8',
        name: 'Shqip',
        country: 'Shqipëri',
        flag: 'icon-flag_albania'
    },{
        lingua: 'sw_KE',
        charset: 'iso-8859-1',
        name: 'Kiswahili',
        country: 'Kenya',
        flag: 'icon-flag_kenya'
    },{
        lingua: 'sw_TZ',
        charset: 'iso-8859-1',
        name: 'Kiswahili',
        country: 'Tanzania',
        flag: 'icon-flag_tanzania'
    },{
        lingua: 'ta_ANY',
        charset: 'utf-8',
        name: 'தமிழ்',
        country: 'சர்வதேச',
        hidden: true
    },{
        lingua: 'tr_TR',
        charset: 'utf-8',
        name: 'Türkçe',
        country: 'Türkiye',
        flag: 'icon-flag_turkey'
    },{
        lingua: 'uk_UA',
        charset: 'utf-8',
        name: 'украї́нська',
        country: 'Україна',
        flag: 'icon-flag_ukraine'
    },{
        lingua: 'ur_PK',
        charset: 'utf-8',
        name: 'Urdu',
        country: 'پاكِستان',
        flag: 'icon-flag_pakistan',
        direction: 'rtl'
    },{
        lingua: 'vi_VN',
        charset: 'utf-8',
        name: 'Tiếng Việt',
        country: 'Việt Nam',
        flag: 'icon-flag_vietnam'
    }]
});
