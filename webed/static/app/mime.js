var MIME = function () {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function is_root (mime) {
        return mime in {'application/root':1};
    }

    function is_project (mime) {
        return mime in {'application/project':1};
    }

    function is_folder (mime) {
        return mime in {'application/folder':1};
    }

    function is_text (mime) {
        return mime.match (/^text\/.+$/) ? true : false;
    }

    function is_image (mime) {
        return mime.match (/^image\/.+$/) ? true : false;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var map2icon = {}, tmp2icon = {
        'text/plain':'icon-page',
        'image/*': 'icon-picture',
        'application/folder': 'icon-folder',
        'application/project': 'icon-report',
        '*/*': 'icon-bullet_white',
        '*': 'icon-bullet_white'
    }

    $.each (tmp2icon, function (key, value) {
        map2icon['^' + key.replace (/\?/g,'.').replace (/\*/g,'.*')] = value;
    });

    function to_icon (mime, suffix) {
        for (var key in map2icon) {
            if (mime.match (key)) return map2icon[key] + (suffix ? suffix:'');
        } return null;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var map2title = {}, tmp2title = {
        'text/plain':'text',
        'image/*': 'image',
        'application/folder': 'folder',
        'application/project': 'project',
        '*/*': 'document',
        '*': 'document'
    }

    $.each (tmp2title, function (key, value) {
        map2title['^' + key.replace (/\?/g,'.').replace (/\*/g,'.*')] = value;
    });

    function to_title (mime) {
        for (var key in map2title) {
            if (mime.match (key)) return map2title[key];
        } return null;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return {
        is_root: is_root,
        is_text: is_text,
        is_image: is_image,
        to_icon: to_icon,
        to_title: to_title
    };

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
}();
