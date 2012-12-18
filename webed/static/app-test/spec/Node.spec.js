describe ('NodeController', function () {
    Ext.require('Webed.controller.Node');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var controller = null, lock = function () {
        var list = []; return {
            init: function (ls) { list = ls||[]; },
            empty: function () { return list.length == 0; },
            clear: function () { list = []; },
            push: function (el) { list.push (el); },
            pop: function () { return list.pop (); }
        }
    }();

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!controller) controller = window.app.getController ('Node');
        expect (controller).toBeTruthy (); controller.init ();
    });

    afterEach (function () {
        controller = null;

        lock.init ([true]); Ext.Ajax.request ({
            url: '/reset/', callback: function (opt, success, xhr) {
                expect (success).toBeTruthy (); lock.pop ();
            }
        });

        waitsFor (function () { return lock.empty (); }, 'reset', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should set nodes', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

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
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get nodes', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

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

            function on_get (nodes, index) {
                expect (nodes).toBeTruthy ();
                expect (nodes.length).toBeGreaterThan (0);
                expect (nodes.length).toBeGreaterThan (index);
                expect (nodes[index]).toBeTruthy ();
                expect (nodes[index].get ('root_uuid')).toEqual (uuid);
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
