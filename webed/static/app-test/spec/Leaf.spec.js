describe ('LeafController', function () {
    Ext.require('Webed.controller.Leaf');

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

        waitsFor (function () { return lock.empty (); }, 'reset', 500);
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
            var uuid = root.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('set_leaf', this, {
                scope: this, callback: on_set, leaf: [{
                    root_uuid: uuid,
                    name: 'leaf',
                    mime: 'plain/text'
                },{
                    root_uuid: uuid,
                    name: 'leaf',
                    mime: 'plain/text'
                }]
            });

            function on_set (leaf, op, index) {
                expect (leaf).toBeTruthy ();
                expect (leaf.get ('root_uuid')).toEqual (uuid);
                expect (leaf.get ('name')).toEqual ('leaf');
                expect (leaf.get ('mime')).toEqual ('plain/text');
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get leafs', function () {
        var leafs = window.app.getStore ('Leafs');
        expect (leafs).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

        leafs.load ({scope: this, callback: function (records, op, success) {
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
                expect (leafs[index]).not.toBeUndefined ();
                expect (leafs[index].get ('mime')).toEqual ('text/plain');
                lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
