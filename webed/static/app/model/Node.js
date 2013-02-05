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

    isProject: function () {
        var mime = this.get ('mime'); return (mime)
            ? mime.match (/^application\/project/) : false;
    },

    isFolder: function () {
        var mime = this.get ('mime'); return (mime)
            ? mime.match (/^application\/folder/) : false;
    },

    getTitle: function (capitalize) {
        var title = (function (node) {
            if (node.isProject ()) return 'Project';
            else if (node.isFolder ()) return 'Folder';
            else return 'Document';
        })(this);

        if (capitalize) {
            return title;
        } else {
            return title.toLowerCase ();
        }
    }
});
