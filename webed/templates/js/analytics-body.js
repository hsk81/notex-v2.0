function ga_init () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
 /* ga.src = ('https:' == document.location.protocol
        ? "{% assets 'ga-ssl' %}{{ ASSET_URL }}{% endassets %}"
        : "{% assets 'ga-www' %}{{ ASSET_URL }}{% endassets %}");
 */ ga.src = ('https:' == document.location.protocol
        ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
}