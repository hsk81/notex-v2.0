describe ('PropertyGrid', function () {
    Ext.require ('Webed.controller.PropertyGrid');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var tree = null, grid = null, nodes = null, props = null;

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (Ext.get ('test-area'))
            Ext.removeNode (Ext.get ('test-area').dom);
        Ext.DomHelper.append (Ext.getBody (),
            "<div id='test-area' style='display:none'/>");

        if (!tree) tree = window.app.getController ('NodeTree');
        expect (tree).toBeTruthy (); tree.init ();
        if (!grid) grid = window.app.getController ('PropertyGrid');
        expect (grid).toBeTruthy (); grid.init ();

        if (!nodes) nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();
        if (!props) props = window.app.getStore ('Properties');
        expect (props).toBeTruthy ();

        props.load (); waitsFor (function () {
            return !props.isLoading ();
        }, 'props store to load', 750);
    });

    afterEach (function () {
        tree = null;
        grid = null;
        nodes = null;
        props = null;

        var reset = null; Ext.Ajax.request ({
            url: '/reset/', callback: function (opt, success, xhr) {
                expect (success).toBeTruthy ();
                reset = success;
            }
        });

        waitsFor (function () { return reset; }, 'reset', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should create a property', function () {

        expect (nodes).toBeTruthy ();
        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var record = records[0];
            expect (record).toBeTruthy ();
            var uuid = record.get ('uuid');
            expect (uuid).toBeTruthy ();

            expect (window.app).toBeTruthy ();
            window.app.fireEvent ('create_property', this, {
                scope: this, callback: callback, property: {
                    node_uuid: uuid,
                    name: 'flag',
                    data: '{key: value}',
                    mime: 'application/json',
                    type: 'StringProperty'
                }
            });

            function callback (rec, op) {
                expect (rec).toBeTruthy ();
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();

                expect (rec.get ('node_uuid')).toEqual (uuid);
                expect (rec.get ('name')).toEqual ('flag');
                expect (rec.get ('data')).toEqual ('{key: value}');
                expect (rec.get ('mime')).toEqual ('application/json');
                expect (rec.get ('type')).toEqual ('StringProperty');
            }
        }});

        waitsFor (function () {
            return !nodes.isLoading ();
        }, 'nodes store to load', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
