describe ('PropertyController', function () {
    Ext.require('Webed.controller.Property');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var lock = function () {
        var list = []; return {
            empty: function () { return list.length == 0; },
            push: function (el) { list.push (el); },
            pop: function () { return list.pop (); },
            clear: function () { list = []; },
            init: function () { list = [true]; }
        }
    }();

    var nodes_ctrl = null, props_ctrl = null;

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!nodes_ctrl) nodes_ctrl = window.app.getController ('NodeTree');
        expect (nodes_ctrl).toBeTruthy (); nodes_ctrl.init ();
        if (!props_ctrl) props_ctrl = window.app.getController ('Property');
        expect (props_ctrl).toBeTruthy (); props_ctrl.init ();

        lock.init (); // Ensures that callback expectations are met!
    });

    afterEach (function () {
        nodes_ctrl = null;
        props_ctrl = null;

        var reset = null; Ext.Ajax.request ({
            url: '/reset/', callback: function (opt, success, xhr) {
                expect (success).toBeTruthy ();
                reset = success;
            }
        });

        waitsFor (function () { return reset; }, 'reset', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should set a property', function () {
        var nodes = window.app.getStore ('Nodes');
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

            function on_set (prop, op) {
                expect (prop).toBeTruthy ();
                expect (prop.get ('node_uuid')).toEqual (uuid);
                expect (prop.get ('name')).toEqual ('flag');
                expect (prop.get ('data')).toEqual ('....');
                expect (prop.get ('mime')).toEqual ('plain/text');
                expect (prop.get ('type')).toEqual ('StringProperty');
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    it ('should set properties', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var node = records[0];
            expect (node).toBeTruthy ();
            var uuid = node.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('set_properties', this, {
                scope: this, callback: on_set, properties: [{
                    node_uuid: uuid,
                    name: 'flag-1',
                    data: '....',
                    mime: 'plain/text',
                    type: 'StringProperty'
                },{
                    node_uuid: uuid,
                    name: 'flag-2',
                    data: '....',
                    mime: 'plain/text',
                    type: 'StringProperty'
                }]
            });

            function on_set (props, ops) {
                expect (props).toBeTruthy ();
                expect (props.length).toEqual (2);

                var prop = props[0];
                expect (prop).toBeTruthy ();
                expect (prop).toBeTruthy ();
                expect (prop.get ('node_uuid')).toEqual (uuid);
                expect (prop.get ('name')).toEqual ('flag-1');
                expect (prop.get ('data')).toEqual ('....');
                expect (prop.get ('mime')).toEqual ('plain/text');
                expect (prop.get ('type')).toEqual ('StringProperty');

                var prop = props[1];
                expect (prop).toBeTruthy ();
                expect (prop).toBeTruthy ();
                expect (prop.get ('node_uuid')).toEqual (uuid);
                expect (prop.get ('name')).toEqual ('flag-2');
                expect (prop.get ('data')).toEqual ('....');
                expect (prop.get ('mime')).toEqual ('plain/text');
                expect (prop.get ('type')).toEqual ('StringProperty');

                expect (ops).toBeTruthy ();
                expect (ops.length).toEqual (2);
                var op = ops[0];
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                var op = ops[1];
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get a property', function () {
        var nodes = window.app.getStore ('Nodes');
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
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    it ('should get properties', function () {
        var nodes = window.app.getStore ('Nodes');
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
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
