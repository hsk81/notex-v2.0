describe ('NodeController', function () {
    Ext.require('Webed.controller.Node');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var controller = null, lock = create_lock ();

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!controller) controller = window.app.getController ('Node');
        expect (controller).toBeTruthy (); controller.init ();
    });

    afterEach (function () {
        controller = null;

        lock.init ([true]); Ext.Ajax.request ({
            url: '/refresh/', callback: function (opt, success, xhr) {
                expect (success).toBeTruthy (); lock.pop ();
            }
        });

        waitsFor (function () { return lock.empty (); }, 'unlock');
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
            var root_uuid = root.get ('uuid');
            expect (root_uuid).toBeTruthy ();
            var uuid_path = root.get ('uuid_path');
            expect (uuid_path).toBeTruthy ();
            var name_path = root.get ('name_path');
            expect (name_path).toBeTruthy ();

            window.app.fireEvent ('set_node', this, {
                scope: this, callback: on_set, node: [{
                    root_uuid: root_uuid,
                    uuid_path: uuid_path,
                    name_path: name_path,
                    name: 'node',
                    mime: 'plain/text',
                    size: 666 // read-only (backend size untouched!)
                },{
                    root_uuid: root_uuid,
                    uuid_path: uuid_path,
                    name_path: name_path,
                    name: 'node',
                    mime: 'plain/text',
                    size: 666 // read-only (backend size untouched!)
                }]
            });

            function on_set (node, op, index) {
                expect (node).toBeTruthy ();
                expect (node.get ('root_uuid')).toEqual (root_uuid);
                expect (node.get ('uuid')).toBeTruthy ();
                expect (node.get ('uuid_path')).toEqual (
                    uuid_path.concat ([node.get ('uuid')]));
                expect (node.get ('name')).toEqual ('node');
                expect (node.get ('name_path')).toEqual (
                    name_path.concat ([node.get ('name')]));
                expect (node.get ('mime')).toEqual ('plain/text');
                expect (node.get ('size')).toEqual (666);
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                expect (index).toBeGreaterThan (-1);
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock');
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get nodes', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

        nodes.load ({scope: this, callback: function (records) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var root = records[0];
            expect (root).toBeTruthy ();
            var uuid = root.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('get_node', this, {
                scope: this, callback: on_get, node: [{
                    uuid: uuid
                },{
                    uuid: uuid
                }]
            });

            function on_get (nodes, index) {
                expect (nodes).toBeTruthy ();
                expect (nodes.length).toBeGreaterThan (0);
                expect (nodes[0]).not.toBeUndefined ();
                expect (nodes[0].get ('uuid')).toEqual (uuid);
                expect (index).toBeGreaterThan (-1);
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock');
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
