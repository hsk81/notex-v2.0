(function () {

    Ext.define ('Webed.view.ContentTabs', {
        extend: 'Ext.tab.Panel',
        alias: 'widget.content-tabs',
        html: splash ('ЩebEd', 'A web based text editor')
    });

    function splash (title, subtitle) {

        var result = [
            '<div id="splash">',
                '<div class="inner">',
                    '<div class="title">', title, '</div>',
                    '<div class="sub-title">',
                        '<hr>',
                        '<a class="icon-information link-icon information"',
                        'target="_blank" href="/about/">_</a>',
                        '<div class="text">', subtitle, '</div>',
                        '<a class="icon-facebook-16 link-icon facebook"',
                        'target="_blank" href="http://facebook.com">_</a>',
                        '<a class="icon-twitter_1-16 link-icon twitter"',
                        'target="_blank" href="http://twitter.com">_</a>',
                        '<a class="icon-blogger-16 link-icon blogger"',
                        'target="_blank" href="http://blogger.com">_</a>',
                        '<a class="icon-youtube-16 link-icon youtube"',
                        'target="_blank" href="http://youtube.com">_</a>',
                    '</div>',
                '</div>',
            '</div>'
        ];

        return result.join ('\n');
    }
})();
