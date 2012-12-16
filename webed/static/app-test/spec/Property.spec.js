describe ('PropertyController', function () {
    Ext.require('Webed.controller.Property');

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
        if (!controller) controller = window.app.getController ('Property');
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

    it ('should set properties', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var node = records[0];
            expect (node).toBeTruthy ();
            var uuid = node.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('set_property', this, {
                scope: this, callback: on_set, property: [{
                    node_uuid: uuid,
                    name: 'flag',
                    data: '....',
                    mime: 'plain/text',
                    type: 'StringProperty'
                },{
                    node_uuid: uuid,
                    name: 'flag',
                    data: '....',
                    mime: 'plain/text',
                    type: 'StringProperty'
                }]
            });

            function on_set (prop, op, index) {
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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should get properties', function () {
        var nodes = window.app.getStore ('Nodes');
        expect (nodes).toBeTruthy ();

        lock.init ([true, true]); // ensure callback verification!

        nodes.load ({scope: this, callback: function (records, op, success) {
            expect (records).toBeTruthy ();
            expect (records.length).toBeGreaterThan (0);

            var node = records[0];
            expect (node).toBeTruthy ();
            var uuid = node.get ('uuid');
            expect (uuid).toBeTruthy ();

            window.app.fireEvent ('get_property', this, {
                scope: this, callback: on_get, property: [{
                    node_uuid: uuid,
                    name: 'data'
                },{
                    node_uuid: uuid,
                    name: 'data'
                }]
            });

            function on_get (props, op, index) {
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
