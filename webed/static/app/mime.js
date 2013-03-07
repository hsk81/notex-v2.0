var MIME = function () {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function is_root (mime) {
        return !!mime.match (/^application\/root$/);
    }

    function is_project (mime) {
        return !!mime.match (/^application\/project(?:\+\w+)?$/);
    }

    function is_folder (mime) {
        return !!mime.match (/^application\/folder$/);
    }

    function is_text (mime, no_fallback, store) {

        function internal () {
            return (no_fallback != undefined)
                ? !!mime.match (/^text\/[^*]+$/)
                : !!mime.match (/^text\/.+$/)
        }

        if (store == undefined) {
            store = assert (Ext.getStore ('MIMEs'));
            if (!store) store = Ext.create ('Webed.store.MIMEs');
        }

        var records = store.query ('mime', mime);
        if (records.getCount () > 0) {
            var record = assert (records.getAt (0));
            var flag = assert (record.get ('flag'));
            if (flag.text) return record;
        }

        return internal ();
    }

    function is_image (mime, no_fallback, store) {

        function internal () {
            return (no_fallback != undefined)
                ? !!mime.match (/^image\/[^*]+$/)
                : !!mime.match (/^image\/.+$/)
        }

        if (store == undefined) {
            store = assert (Ext.getStore ('MIMEs'));
            if (!store) store = Ext.create ('Webed.store.MIMEs');
        }

        var records = store.query ('mime', mime);
        if (records.getCount () > 0) {
            var record = assert (records.getAt (0));
            var flag = assert (record.get ('flag'));
            if (flag.image) return record;
        }

        return internal ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function for_mime (mime, property, store) {
        var query = assert (store.query ('mime', mime, false, false, true));
        return (query.getCount () > 0) ? property (query.getAt (0)) : null;
    }

    function for_image (mime, property, store) {

        var image = is_image (mime, null, store);
        if (image instanceof Webed.model.MIME) return property (image);
        if (image) {
            var query = assert (store.query ('mime', /^image\/\*$/));
            if (query.getCount () > 0) return property (query.getAt (0));
        }

        return null;
    }

    function for_text (mime, property, store) {

        var text = is_text (mime, null, store);
        if (text instanceof Webed.model.MIME) return property (text);
        if (text) {
            var query = assert (store.query ('mime', /^text\/\*$/));
            if (query.getCount () > 0) return property (query.getAt (0));
        }

        return null;
    }

    function for_doc (mime, property, store) {
        var query = assert (store.query ('mime', /^\*$/));
        return (query.getCount () > 0) ? property (query.getAt (0)) : null;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return {
        is_root: is_root,
        is_project: is_project,
        is_folder: is_folder,
        is_text: is_text,
        is_image: is_image,

        to_name: function (mime) {
            var store = Ext.getStore ('MIMEs');
            if (!store) store = Ext.create ('Webed.store.MIMEs');

            function name (record) {
                return assert (record.get ('name'));
            }

            var rec_name = for_mime (mime, name, store);
            if (rec_name) return rec_name;
            var img_name = for_image (mime, name, store);
            if (img_name) return img_name;
            var txt_name = for_text (mime, name, store);
            if (txt_name) return txt_name;
            var doc_name = for_doc (mime, name, store);
            if (doc_name) return doc_name;

            assert (mime, 'invalid mime');
            return null;
        },

        to_icon: function (mime, suffix) {
            var store = Ext.getStore ('MIMEs');
            if (!store) store = Ext.create ('Webed.store.MIMEs');

            function icon (record) {
                return assert (record.get ('icon')) + (suffix ? suffix : '');
            }

            var rec_icon = for_mime (mime, icon, store);
            if (rec_icon) return rec_icon;
            var img_icon = for_image (mime, icon, store);
            if (img_icon) return img_icon;
            var txt_icon = for_text (mime, icon, store);
            if (txt_icon) return txt_icon;
            var dic_icon = for_doc (mime, icon, store);
            if (dic_icon) return dic_icon;

            assert (mime, 'invalid mime');
            return null;
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
}();
