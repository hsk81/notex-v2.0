describe ('NodeTree', function () {
    Ext.require ('Webed.view.NodeTree');
    Ext.require ('Webed.controller.Node');
    Ext.require ('Webed.controller.Leaf');
    Ext.require ('Webed.controller.NodeTree');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var tree_ctrl = null, node_ctrl = null, leaf_ctrl = null;
    var view = null, store = null, lock = create_lock ();

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    beforeEach (function () {
        if (Ext.get ('test-area'))
            Ext.removeNode (Ext.get ('test-area').dom);
        Ext.DomHelper.append (Ext.getBody (),
            "<div id='test-area' style='display:none'/>");

        if (!view) view = Ext.create ( 'Webed.view.NodeTree', {
            renderTo: 'test-area'
        });

        expect (view).toBeTruthy ();
        if (!tree_ctrl) tree_ctrl = window.app.getController ('NodeTree');
        expect (tree_ctrl).toBeTruthy (); tree_ctrl.init ();

        if (!node_ctrl) node_ctrl = window.app.getController ('Node');
        expect (node_ctrl).toBeTruthy (); node_ctrl.init ();
        if (!leaf_ctrl) leaf_ctrl = window.app.getController ('Leaf');
        expect (leaf_ctrl).toBeTruthy (); leaf_ctrl.init ();

        if (!store) store = window.app.getStore ('Nodes');
        expect (store).toBeTruthy ();
        store.loadLock.clear ();
        expect (store.loadLock.empty ()).toBeTruthy ();

        lock.init ([true]); store.load ({
            scope: this, callback: function (recs, op) {
                expect (recs).toBeTruthy ();
                expect (recs.length).toBeGreaterThan (0);
                expect (op).toBeTruthy ();
                expect (op.success).toBeTruthy ();
                lock.pop ();
            }
        });

        waitsFor (function () { return lock.empty (); }, 'unlock');
    });

    afterEach (function () {
        view.destroy ();
        view = null;
        tree_ctrl = null;
        store = null;
        node_ctrl = null;
        leaf_ctrl = null;

        lock.init ([true]); Ext.Ajax.request ({
            url: '/refresh/', callback: function (opt, success, xhr) {
                expect (success).toBeTruthy (); lock.pop ();
            }
        });

        waitsFor (function () { return lock.empty (); }, 'unlock');
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should create a node', function () {

        function create (node) {
            node = Ext.apply (node||{}, {
                uuid: UUID.random ()
            });

            var root_uuid = node.root.get ('uuid');
            expect (root_uuid).toBeTruthy ();

            lock.init ([true]); window.app.fireEvent ('create_node', {
                where: node, scope: this, callback: function (rec, op) {
                    expect (rec).toBeTruthy ();
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();
                    expect (rec.get ('uuid')).toEqual (node.uuid);
                    expect (rec.get ('mime')).toEqual (node.mime);
                    expect (rec.get ('name')).toEqual (node.name);
                    expect (rec.get ('root_uuid')).toEqual (root_uuid);
                    lock.pop ();
                }
            });

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { create ({
            name: 'node',
            mime: 'application/project',
            root: store.getRootNode ()
        })});
    });

    it ('should create a leaf', function () {

        function create (leaf) {
            leaf = Ext.apply (leaf||{}, {
                uuid: UUID.random ()
            });

            var root_uuid = leaf.root.get ('uuid');
            expect (root_uuid).toBeTruthy ();

            lock.init ([true]); window.app.fireEvent ('create_leaf', {
                where: leaf, scope: this, callback: function (rec, op) {
                    expect (rec).toBeTruthy ();
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();
                    expect (rec.get ('uuid')).toEqual (leaf.uuid);
                    expect (rec.get ('mime')).toEqual (leaf.mime);
                    expect (rec.get ('name')).toEqual (leaf.name);
                    expect (rec.get ('root_uuid')).toEqual (root_uuid);
                    lock.pop ();
                }
            });

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { create ({
            name: 'leaf',
            mime: 'text/plain',
            root: store.getRootNode ()
        })});
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should read nodes', function () {

        function load (mime) {
            lock.init ([true]); store.load ({
                scope: this, callback: function (recs, op) {

                    expect (recs).toBeTruthy ();
                    expect (recs.length).toBeGreaterThan (0);
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();

                    var root = store.getRootNode ();
                    expect (root).toBeTruthy ();
                    var node = root.findChild ('mime', mime, true);
                    expect (node).toBeTruthy ();

                    lock.pop ();
                }
            })

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { load ('application/project+rest'); });
    });

    it ('should read leafs', function () {

        function load (mime) {
            lock.init ([true]); store.load ({
                scope: this, callback: function (recs, op) {

                    expect (recs).toBeTruthy ();
                    expect (recs.length).toBeGreaterThan (0);
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();

                    var root = store.getRootNode ();
                    expect (root).toBeTruthy ();
                    var node = root.findChild ('mime', mime, true);
                    expect (node).toBeTruthy ();

                    lock.pop ();
                }
            })

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { load ('text/plain'); });
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should update a node', function () {

        function update (mime) {
            var root = view.getRootNode ();
            expect (root).toBeTruthy ();
            var node = root.findChild ('mime', mime, true)
            expect (node).toBeTruthy ();
            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();

            semo.select (node);

            lock.init ([true]); window.app.fireEvent ('update_node', {
                scope: this, callback: function (rec, op) {
                    expect (rec.get ('uuid')).toEqual (node.get ('uuid'));
                    expect (rec.get ('mime')).toEqual (mime);
                    expect (rec.get ('name')).toEqual ('node');
                    expect (op.success).toBeTruthy ();
                    lock.pop ();
                }, node: node, to: {name:'node'}
            });

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { update ('application/project+rest'); });
    });

    it ('should update a leaf', function () {

        function update (mime) {
            var root = view.getRootNode ();
            expect (root).toBeTruthy ();
            var leaf = root.findChild ('mime', mime, true)
            expect (leaf).toBeTruthy ();
            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();

            semo.select (leaf);

            lock.init ([true]); window.app.fireEvent ('update_leaf', {
                scope: this, callback: function (rec, op) {
                    expect (rec).toBeTruthy ();
                    expect (rec.get ('uuid')).toEqual (leaf.get ('uuid'));
                    expect (rec.get ('mime')).toEqual (mime);
                    expect (rec.get ('name')).toEqual ('leaf');
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();
                    lock.pop ();
                }, node: leaf, to: {name:'leaf'}
            });

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { update ('text/plain'); });
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    it ('should delete a node', function () {

        function destroy (mime) {
            var root = view.getRootNode ();
            expect (root).toBeTruthy ();
            var node = root.findChild ('mime', mime, true)
            expect (node).toBeTruthy ();
            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();

            semo.select (node);

            lock.init ([true]); window.app.fireEvent ('delete_node', {
                scope: this, callback: function (rec, op) {
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();
                    lock.pop ();
                }, node: node
            });

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { destroy ('application/project+rest'); });
    });

    it ('should delete a leaf', function () {

        function destroy (mime) {
            var root = view.getRootNode ();
            expect (root).toBeTruthy ();
            var leaf = root.findChild ('mime', mime, true)
            expect (leaf).toBeTruthy ();
            var semo = view.getSelectionModel ();
            expect (semo).toBeTruthy ();

            semo.select (leaf);

            lock.init ([true]); window.app.fireEvent ('delete_leaf', {
                scope: this, callback: function (rec, op) {
                    expect (op).toBeTruthy ();
                    expect (op.success).toBeTruthy ();
                    lock.pop ();
                }, node: leaf
            });

            waitsFor (function () { return lock.empty (); }, 'unlock');
        }

        runs (function () { destroy ('text/plain'); });
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
