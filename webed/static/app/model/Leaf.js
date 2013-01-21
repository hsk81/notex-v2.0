Ext.define ('Webed.model.Leaf', {
    extend: 'Ext.data.Model',
    fields: [
        'uuid_path', 'name_path', 'root_uuid', 'uuid', 'name', 'mime', 'size'
    ],

    proxy: {
        type: 'rest',
        url: '/leaf',
        reader: {
            type: 'json', root: 'results', totalProperty: 'total'
        },

        filterParam: 'filters', encodeFilters: function (filters) {

            function map (value) {
                switch (value) {
                    case 'name_path': return 'name_path';
                    case 'uuid_path': return 'uuid_path';
                    case 'root_uuid': return null;
                    case 'uuid': return 'uuid';
                    case 'name': return 'name';
                    case 'mime': return 'mime';
                    case 'size': return null;
                    default: return null;
                }
            }

            return JSON.stringify (filters.map (function (el, index) {
                var property = map (el.property);
                assert (property);
                var regex = el.regex.source;
                assert (regex);
                var ignore_case = el.regex.ignoreCase;
                assert (ignore_case != undefined);

                return {
                    property: property, regex: regex, ignore_case: ignore_case
                };
            }));
        }
    }
});
