function ga_init () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
 /* ga.src = ('https:' == document.location.protocol
        ? "{{ url_for('static', filename='ga/ga-ssl.js') }}"
        : "{{ url_for('static', filename='ga/ga-www.js') }}");
 */ ga.src = ('https:' == document.location.protocol
        ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
}