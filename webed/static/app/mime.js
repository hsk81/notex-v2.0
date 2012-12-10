var MIME = function () {

    var map = {}, tmp = {
        'text/plain':'icon-page',
        'image/*': 'icon-picture',
        'application/folder': 'icon-folder',
        'application/project': 'icon-report',
        '*/*': 'icon-bullet_white',
        '*': 'icon-bullet_white'
    }

    $.each (tmp, function (key, value) {
        map['^' + key.replace (/\?/g,'.').replace (/\*/g,'.*') + '\$'] = value;
    });

    function to_icon (mime, suffix) {
        for (var key in map) {
            if (mime.match (key)) return map[key] + (suffix ? suffix : '');
        }
    }

    return {
        to_icon: to_icon
    };
}();
