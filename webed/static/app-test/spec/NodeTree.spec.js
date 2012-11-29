describe ('NodeTree', function () {
    var store = null, controller = null;

    beforeEach (function () {
        if (!controller) controller = App.getController ('NodeTree');
        expect (controller).toBeTruthy ();
        if (!store) store = controller.getStore ('Nodes');
        expect (store).toBeTruthy ();
    });

    it ('should have nodes', function () {
        store.on ('load', function (store, node, records, successful, opts) {
            expect (successful).toBeTruthy ();
            expect (records.length).toBeGreaterThan (1);
        }, this);

        store.load (); waitsFor (function () {
            return !store.isLoading ();
        }, 'load never completed', 250);
    });
});
