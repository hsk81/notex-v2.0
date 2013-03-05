var MIME = function () {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function is_root (mime) {
        return mime.match (/^application\/root/) ? true : false;
    }

    function is_project (mime) {
        return mime.match (/^application\/project/) ? true : false;
    }

    function is_folder (mime) {
        return mime.match (/^application\/folder/) ? true : false;
    }

    function is_text (mime) {
        return mime.match (/^text\/.+$/) ? true : false;
    }

    function is_image (mime) {
        return mime.match (/^image\/.+$/) ? true : false;
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

            if (mime) {
                var RECs = assert (store.query ('mime', mime));
                if (RECs.getCount () > 0) return name (RECs.getAt (0));
            }
            if (mime && is_image (mime)) {
                var IMGs = assert (store.query ('mime', /^image\/\*$/));
                if (IMGs.getCount () > 0) return name (IMGs.getAt (0));
            }
            if (mime && is_text (mime)) {
                var TXTs = assert (store.query ('mime', /^text\/\*$/));
                if (TXTs.getCount () > 0) return name (TXTs.getAt (0));
            }
            if (mime) { // fallback && assert (mime)
                var DOCs = assert (store.query ('mime', /^*$/));
                if (DOCs.getCount () > 0) return name (DOCs.getAt (0));
            }

            assert (mime, 'invalid mime');
            return null;
        },

        to_icon: function (mime, suffix) {
            var store = Ext.getStore ('MIMEs');
            if (!store) store = Ext.create ('Webed.store.MIMEs');

            function icon (record) {
                return assert (record.get ('icon')) + (suffix ? suffix : '');
            }

            if (mime) {
                var RECs = assert (store.query ('mime', mime));
                if (RECs.getCount () > 0) return icon (RECs.getAt (0));
            }
            if (mime && is_image (mime)) {
                var IMGs = assert (store.query ('mime', /^image\/\*$/));
                if (IMGs.getCount () > 0) return icon (IMGs.getAt (0));
            }
            if (mime && is_text (mime)) {
                var TXTs = assert (store.query ('mime', /^text\/\*$/));
                if (TXTs.getCount () > 0) return icon (TXTs.getAt (0));
            }
            if (mime) { // fallback && assert (mime)
                var DOCs = assert (store.query ('mime', /^*$/));
                if (DOCs.getCount () > 0) return icon (DOCs.getAt (0));
            }

            assert (mime, 'invalid mime');
            return null;
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
}();
