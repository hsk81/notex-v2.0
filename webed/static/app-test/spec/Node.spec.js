describe ('NodeController', function () {
    Ext.require('Webed.controller.Node');

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

    var controller = null;

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!controller) controller = window.app.getController ('Node');
        expect (controller).toBeTruthy (); controller.init ();

        lock.init (); // ensures that callback expectations are verified!
    });

    afterEach (function () {
        controller = null;

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

    it ('should set a node', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var root = records[0];
            expect (root).toBeTruthy ();
            var uuid = root.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('set_node', this, {
                scope: this, callback: on_set, node: {
                    root_uuid: uuid,
                    name: 'node',
                    mime: 'plain/text'
                }
            });

            function on_set (node, op) {
                expect (node).toBeTruthy ();
                expect (node.get ('root_uuid')).toEqual (uuid);
                expect (node.get ('name')).toEqual ('node');
                expect (node.get ('mime')).toEqual ('plain/text');
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    it ('should set nodes', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var root = records[0];
            expect (root).toBeTruthy ();
            var uuid = root.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('set_nodes', this, {
                scope: this, callback: on_set, nodes: [{
                    root_uuid: uuid,
                    name: 'node-1',
                    mime: 'plain/text'
                },{
                    root_uuid: uuid,
                    name: 'node-2',
                    mime: 'plain/text'
                }]
            });

            function on_set (nodes, ops) {
                expect (nodes).toBeTruthy ();
                expect (nodes.length).toEqual (2);

                var node = nodes[0];
                expect (node).toBeTruthy ();
                expect (node.get ('root_uuid')).toEqual (uuid);
                expect (node.get ('name')).toEqual ('node-1');
                expect (node.get ('mime')).toEqual ('plain/text');
                var node = nodes[1];
                expect (node).toBeTruthy ();
                expect (node.get ('root_uuid')).toEqual (uuid);
                expect (node.get ('name')).toEqual ('node-2');
                expect (node.get ('mime')).toEqual ('plain/text');

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

    it ('should get a node', function () {
    });

    it ('should get nodes', function () {
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
