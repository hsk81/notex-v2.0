describe ('Init', function() {

    it ('has ExtJS4 loaded', function () {
        expect (Ext).toBeDefined ();
        expect (Ext.getVersion ()).toBeTruthy ();
        expect (Ext.getVersion ().major).toEqual (4);
    });

    it ('has Webed loaded',function (){
        expect (Webed).toBeDefined ();
    });
});
