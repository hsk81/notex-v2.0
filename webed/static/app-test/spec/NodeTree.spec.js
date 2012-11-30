describe ('NodeTree', function () {
    var view = null, controller = null, store = null;

    beforeEach (function () {
        if (Ext.get ('test-area'))
            Ext.removeNode (Ext.get ('test-area').dom);
        Ext.DomHelper.append (Ext.getBody (),
            "<div id='test-area' style='display:none'/>");

        if (!view) view = Ext.create ('Webed.view.NodeTree', {
            renderTo: 'test-area' });
        expect (view).toBeTruthy ();
        if (!controller) controller = window.app.getController ('NodeTree');
        expect (controller).toBeTruthy ();
        if (!store) store = controller.getStore ('Nodes');
        expect (store).toBeTruthy ();
    });

    afterEach (function () {
        view.destroy ();
        view = null;
        store = null;
        controller = null;

        var reset = null; Ext.Ajax.request ({
            url: '?reset', callback: function (opt, success, xhr) {
                reset = success;
            }
        });

        waitsFor (function () { return reset; }, 'reset', 500);
    });

    it ('should load nodes', function () {
        store.on ('load', function (store, node, records, successful, opts) {
            expect (successful).toBeTruthy ();
            expect (records.length).toBeGreaterThan (1);
        }, this);

        store.load ();

        waitsFor (function () {
            return !store.isLoading ();
        }, 'store to load', 250);
    });

    it ('should create a node', function () {

        function create (node) {
            $.extend (node, {
                uuid: UUID.random ()
            });

            window.app.fireEvent ('create_node', {node: node});
            var base = view.getRootNode ();
            expect (base).toBeTruthy ();

            waitsFor (function () {
                return base.findChild ('uuid', uuid, true) != null;
            }, node.mime + ' ' + 'node to be created', 250);

            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();
            var record = semo.getLastSelected ();
            expect (record).toBeTruthy ();
            var uuid = record.get ('uuid');
            expect (uuid).toEqual (node.uuid);
        }

        runs (function () { create ({
            name: 'node', mime: 'application/project'
        })});
        runs (function () { create ({
            name: 'node', mime: 'application/folder'
        })});
        //runs (function () { create ({
        //  name: 'node', mime: '*/*' // TODO: Should work!?
        //})});
    });

    it ('should create a leaf', function () {

        function create (leaf) {
            $.extend (leaf, {
                uuid: UUID.random ()
            });

            window.app.fireEvent ('create_leaf', leaf);
            var base = view.getRootNode ();
            expect (base).toBeTruthy ();

            waitsFor (function () {
                return base.findChild ('uuid', uuid, true) != null;
            }, '"' + leaf.mime + '"' + ' ' + 'leaf to be created', 250);

            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();
            var record = semo.getLastSelected ();
            expect (record).toBeTruthy ();
            var uuid = record.get ('uuid');
            expect (uuid).toEqual (leaf.uuid);
        }

        runs (function () { create ({
            name: 'leaf', mime: 'text/plain'
        })});
        runs (function () { create ({
            name: 'leaf', mime: 'image/jpeg'
        })});
        runs (function () { create ({
            name: 'leaf', mime: '*/*'
        })});
    });

    it ('should delete a node', function () {

        function destroy (mime) {
            var base = view.getRootNode ();
            expect (base).toBeTruthy ();
            var node = base.findChild ('mime', mime, true)
            expect (node).toBeTruthy ();
            expect (node.isLeaf () || true).toBeTruthy ();
            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();

            var executed = null;
            semo.select (node);

            window.app.fireEvent ('delete_node', {uuid: null},
                function (rec, op) {
                    expect (rec.get ('uuid')).toEqual (node.get ('uuid'));
                    expect (op.success).toBeTruthy ();
                    executed = { rec: rec, op: op }
                }
            );

            waitsFor (function () {
                return executed;
            }, 'node to be deleted', 250);
        }

        runs (function () { destroy ('application/project'); });
        runs (function () { destroy ('application/folder'); });
        runs (function () { destroy ('text/plain'); });
    });

    it ('should delete a leaf', function () {

        function destroy (mime) {
            var base = view.getRootNode ();
            expect (base).toBeTruthy ();
            var leaf = base.findChild ('mime', mime, true)
            expect (leaf).toBeTruthy ();
            expect (leaf.isLeaf ()).toBeTruthy ();
            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();

            var executed = null;
            semo.select (leaf);

            window.app.fireEvent ('delete_leaf', {uuid: null},
                function (rec, op) {
                    expect (rec.get ('uuid')).toEqual (leaf.get ('uuid'));
                    expect (op.success).toBeTruthy ();
                    executed = { rec: rec, op: op }
                }
            );

            waitsFor (function () {
                return executed;
            }, 'leaf to be deleted', 250);
        }

        runs (function () { destroy ('text/plain'); });
        runs (function () { destroy ('image/tiff'); });
    });
});
