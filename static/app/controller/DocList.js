Ext.define ('Webed.controller.DocList', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.control ({
            // TODO: Wire view events!
        });

        this.application.on ({
            synchronize: this.synchronize, scope: this
        });
    },

    synchronize: function () {
        console.debug ('[DocListCtrl.synchronize]', this);
    }
});
