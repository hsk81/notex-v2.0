describe ('LeafController', function () {
    Ext.require('Webed.controller.Leaf');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var controller = null, lock = create_lock ();

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (!controller) controller = window.app.getController ('Leaf');
        expect (controller).toBeTruthy (); controller.init ();
    });

    afterEach (function () {
        controller = null;

        lock.init ([true]); Ext.Ajax.request ({
            url: '/reset/', callback: function (opt, success, xhr) {
                expect (success).toBeTruthy (); lock.pop ();
            }
        });

        waitsFor (function () { return lock.empty (); }, 'reset', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should set leafs', function () {
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
            var name_path = root.get ('name_path');
            expect (name_path).toBeTruthy ();

            window.app.fireEvent ('set_leaf', this, {
                scope: this, callback: on_set, leaf: [{
                    name_path: Ext.Array.push (name_path, 'leaf'),
                    root_uuid: root_uuid,
                    name: 'leaf',
                    mime: 'plain/text',
                    size: 666 // read-only (backend size untouched!)
                },{
                    name_path: Ext.Array.push (name_path, 'leaf'),
                    root_uuid: root_uuid,
                    name: 'leaf',
                    mime: 'plain/text',
                    size: 666 // read-only (backend size untouched!)
                }]
            });

            function on_set (leaf, op, index) {
                expect (leaf).toBeTruthy ();
                expect (leaf.get ('name_path')).toEqual (name_path);
                expect (leaf.get ('root_uuid')).toEqual (root_uuid);
                expect (leaf.get ('name')).toEqual ('leaf');
                expect (leaf.get ('mime')).toEqual ('plain/text');
                expect (leaf.get ('size')).toEqual (666);
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                expect (index).toBeGreaterThan (-1);
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get leafs', function () {
        var leafs = window.app.getStore ('Leafs');
        expect (leafs).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

        leafs.load ({scope: this, callback: function (records) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            window.app.fireEvent ('get_leaf', this, {
                scope: this, callback: on_get, leaf: [{
                    mime: 'text/plain'
                },{
                    mime: 'text/plain'
                }]
            });

            function on_get (leafs, index) {
                expect (leafs).toBeTruthy ();
                expect (leafs.length).toBeGreaterThan (0);
                expect (leafs[0]).not.toBeUndefined ();
                expect (leafs[0].get ('mime')).toEqual ('text/plain');
                expect (index).toBeGreaterThan (-1);
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 750);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
