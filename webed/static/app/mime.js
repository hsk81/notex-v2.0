var MIME = function () {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function is_root (mime) {
        return mime in {
            'application/root':1
        };
    }

    function is_text (mime) {
        return mime in {
            'text/plain':1
        };
    }

    function is_image (mime) {
        return mime.match (/^image\/.+$/) ? true : false;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var map = {}, tmp = {
        'text/plain':'icon-page',
        'image/*': 'icon-picture',
        'application/folder': 'icon-folder',
        'application/project': 'icon-report',
        '*/*': 'icon-bullet_white',
        '*': 'icon-bullet_white'
    }

    $.each (tmp, function (key, value) {
        map['^' + key.replace (/\?/g,'.').replace (/\*/g,'.*')] = value;
    });

    function to_icon (mime, suffix) {
        for (var key in map) {
            if (mime.match (key)) return map[key] + (suffix ? suffix : '');
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return {
        is_root: is_root,
        is_text: is_text,
        is_image: is_image,
        to_icon: to_icon
    };

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
}();
