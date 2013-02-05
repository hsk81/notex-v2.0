Ext.define ('Webed.model.Node', {
    extend: 'Ext.data.Model',
    fields: [
        'uuid_path', 'name_path', 'root_uuid', 'uuid', 'name', 'mime', 'size'
    ],

    proxy: {
        type: 'rest', url: '/node', reader: {
            type: 'json', root: 'results'
        }
    },

    getTitle: function (capitalize) {
        var mime = this.get ('mime');
        assert (mime);
        var title = MIME.to_title (mime);
        assert (title);

        if (capitalize) {
            return title.slice (0,1).toUpperCase () + title.slice (1);
        } else {
            return title;
        }
    }
});
