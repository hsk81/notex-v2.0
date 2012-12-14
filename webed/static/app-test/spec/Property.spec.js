describe ('Property controller', function () {
    Ext.require ('Webed.controller.Property');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var tree = null, grid = null, nodes = null, props = null;

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!tree) tree = window.app.getController ('NodeTree');
        expect (tree).toBeTruthy (); tree.init ();
        if (!grid) grid = window.app.getController ('Property');
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

    it ('should set a property', function () {

        expect (nodes).toBeTruthy ();
        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var node = records[0];
            expect (node).toBeTruthy ();
            var uuid = node.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('set_property', this, {
                scope: this, callback: on_set, property: {
                    node_uuid: uuid,
                    name: 'flag',
                    data: '....',
                    mime: 'plain/text',
                    type: 'StringProperty'
                }
            });

            function on_set (props, op) {
                expect (props).toBeTruthy ();
                expect (props.length).toEqual (1);
                expect (props[0].get ('node_uuid')).toEqual (uuid);
                expect (props[0].get ('name')).toEqual ('flag');
                expect (props[0].get ('data')).toEqual ('....');
                expect (props[0].get ('mime')).toEqual ('plain/text');
                expect (props[0].get ('type')).toEqual ('StringProperty');
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
            }
        }});

        waitsFor (function () {
            return !nodes.isLoading ();
        }, 'nodes store to load', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get a property', function () {

        expect (nodes).toBeTruthy ();
        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var node = records[0];
            expect (node).toBeTruthy ();
            var uuid = node.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('get_property', this, {
                scope: this, callback: on_get, property: {
                    node_uuid: uuid,
                    name: 'data'
                }
            });

            function on_get (prop, op) {
                expect (prop).toBeUndefined ();
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
            }
        }});

        waitsFor (function () {
            return !nodes.isLoading ();
        }, 'nodes store to load', 750);
    });

    it ('should get properties', function () {

        expect (nodes).toBeTruthy ();
        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var node = records[0];
            expect (node).toBeTruthy ();
            var uuid = node.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('get_properties', this, {
                scope: this, callback: on_get, property: {
                    node_uuid: uuid,
                    name: 'data'
                }
            });

            function on_get (props, op) {
                expect (props).toBeTruthy ();
                expect (props.length).toEqual (0);
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
            }
        }});

        waitsFor (function () {
            return !nodes.isLoading ();
        }, 'nodes store to load', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
