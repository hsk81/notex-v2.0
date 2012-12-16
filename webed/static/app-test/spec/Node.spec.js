describe ('NodeController', function () {
    Ext.require('Webed.controller.Node');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var controller = null, lock = function () {
        var list = []; return {
            empty: function () { return list.length == 0; },
            push: function (el) { list.push (el); },
            pop: function () { return list.pop (); },
            clear: function () { list = []; },
            init: function () { list = [true]; }
        }
    }();

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!controller) controller = window.app.getController ('Node');
        expect (controller).toBeTruthy (); controller.init ();
        lock.init (); // ensures that callback expectations are met!
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
                scope: this, callback: on_set, node: [{
                    root_uuid: uuid,
                    name: 'node',
                    mime: 'plain/text'
                },{
                    root_uuid: uuid,
                    name: 'node',
                    mime: 'plain/text'
                }]
            });

            function on_set (node, op, index) {
                expect (node).toBeTruthy ();
                expect (node.get ('root_uuid')).toEqual (uuid);
                expect (node.get ('name')).toEqual ('node');
                expect (node.get ('mime')).toEqual ('plain/text');
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                if (index+1>=2) lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get a node', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var root = records[0];
            expect (root).toBeTruthy ();
            var uuid = root.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('get_node', this, {
                scope: this, callback: on_get, node: [{
                    root_uuid: uuid
                },{
                    root_uuid: uuid
                }]
            });

            function on_get (nodes, op, index) {
                expect (nodes).toBeTruthy ();
                expect (nodes.length).toBeGreaterThan (0);
                expect (nodes.length).toBeGreaterThan (index);
                expect (nodes[index]).toBeTruthy ();
                expect (nodes[index].get ('root_uuid')).toEqual (uuid);
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                if (index+1>=nodes.length) lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
