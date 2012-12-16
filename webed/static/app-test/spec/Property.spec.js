describe ('PropertyController', function () {
    Ext.require('Webed.controller.Property');

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
        if (!controller) controller = window.app.getController ('Property');
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
                if (index > 0) lock.pop ();
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
                if (index > 0) lock.pop ();
            }
        }});

        waitsFor (function () { return lock.empty (); }, 'unlock', 500);
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
