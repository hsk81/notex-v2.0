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

    var map2icon = {}, map2icon_cache = {}, tmp2icon = {
        'application/folder': 'icon-folder',
        'application/project\\+latex': 'icon-report_latex',
        'application/project\\+rest': 'icon-report_rest',
        'application/project': 'icon-report',
        'image/*': 'icon-picture',
        'text/*':'icon-page',
        '*/*': 'icon-page_white',
        '*': 'icon-page_white'
    };

    $.each (tmp2icon, function (key, value) {
        map2icon['^' + key.replace (/\?/g,'.').replace (/\*/g,'.*')] = value;
    });

    function to_icon (mime, suffix) {
        var result = map2icon_cache[mime];
        if (result) return result;

        var keys = [];
        for (var m2i_key in map2icon) {
            if (map2icon.hasOwnProperty (m2i_key) && mime.match (m2i_key)) {
                keys.push (m2i_key);
            }
        }

        var key = keys.sort ().pop ();
        assert (key);
        var value = map2icon[key] + (suffix ? suffix : '');
        assert (value);

        return map2icon_cache[mime] = value;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var map2title = {}, map2title_cache = {}, tmp2title = {
        'application/folder': 'folder',
        'application/project': 'project',
        'image/*': 'image',
        'text/plain':'text',
        '*/*': 'document',
        '*': 'document'
    }

    $.each (tmp2title, function (key, value) {
        map2title['^' + key.replace (/\?/g,'.').replace (/\*/g,'.*')] = value;
    });

    function to_title (mime) {
        var result = map2title_cache[mime];
        if (result) return result;

        var keys = [];
        for (var m2i_key in map2title) {
            if (map2title.hasOwnProperty (m2i_key) && mime.match (m2i_key)) {
                keys.push (m2i_key);
            }
        }

        var key = keys.sort ().pop ();
        assert (key);
        var value = map2title[key];
        assert (value);

        return map2title_cache[mime] = value;
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
