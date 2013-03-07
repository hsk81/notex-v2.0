Ext.define ('Webed.model.Leaf', {
    extend: 'Ext.data.Model',
    fields: [
        'uuid_path', 'name_path', 'root_uuid', 'uuid', 'name', 'mime', 'size'
    ],

    proxy: {
        type: 'rest', url: '/leaf', reader: {
            type: 'json', root: 'results', totalProperty: 'total'
        },

        filterParam: 'filters', encodeFilters: function (filters) {
            return JSON.stringify (filters.map (function (filter, index) {
                var property = assert (filter.property);
                var regex = assert (filter.regex.source);
                var ignore_case = assert (filter.regex.ignoreCase);

                return {
                    ignore_case: ignore_case,
                    property: property,
                    regex: regex
                };
            }));
        }
    }
});
