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

        var MIMEs = window.app.getStore ('MIMEs');
        expect (MIMEs).toBeTruthy ();
        MIMEs.load ({scope: this, callback: function (recs, op, success) {
            expect (success).toBeTruthy ();
        }});
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

    it ('should set leafs', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();
        nodes.loadLock.clear ();
        expect (nodes.loadLock.empty ()).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!
        expect (lock.empty ()).toBeFalsy ();

        nodes.load ({scope: this, callback: function (records) {
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

            window.app.fireEvent ('set_leaf', this, {
                scope: this, callback: on_set, leaf: [{
                    root_uuid: root_uuid,
                    uuid_path: uuid_path,
                    name_path: name_path,
                    name: 'leaf',
                    mime: 'plain/text',
                    size: 666 // read-only (backend size untouched!)
                },{
                    root_uuid: root_uuid,
                    uuid_path: uuid_path,
                    name_path: name_path,
                    name: 'leaf',
                    mime: 'plain/text',
                    size: 666 // read-only (backend size untouched!)
                }]
            });

            function on_set (leaf, op, index) {
                expect (leaf).toBeTruthy ();
                expect (leaf.get ('root_uuid')).toEqual (root_uuid);
                expect (leaf.get ('uuid')).toBeTruthy ();
                expect (leaf.get ('uuid_path')).toEqual (
                    uuid_path.concat ([leaf.get ('uuid')]));
                expect (leaf.get ('name')).toEqual ('leaf');
                expect (leaf.get ('name_path')).toEqual (
                    name_path.concat ([leaf.get ('name')]));
                expect (leaf.get ('mime')).toEqual ('plain/text');
                expect (leaf.get ('size')).toEqual (666);
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

    it ('should get leafs', function () {
        var leafs = window.app.getStore ('Leafs');
        expect (leafs).toBeTruthy ();
        leafs.loadLock.clear ();
        expect (leafs.loadLock.empty ()).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!
        expect (lock.empty ()).toBeFalsy ();

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

        waitsFor (function () { return lock.empty (); }, 'unlock');
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
