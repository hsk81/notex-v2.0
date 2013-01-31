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
            return JSON.stringify (filters.map (function (el, index) {
                var property = el.property;
                assert (property);
                var regex = el.regex.source;
                assert (regex);
                var ignore_case = el.regex.ignoreCase;
                assert (ignore_case != undefined);

                return {
                    ignore_case: ignore_case,
                    property: property,
                    regex: regex
                };
            }));
        }
    }
});
