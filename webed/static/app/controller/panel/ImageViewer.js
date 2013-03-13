Ext.define ('Webed.controller.panel.ImageViewer', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'image-viewer', ref: 'imageViewer'
    }],

    init: function () {
        this.control ({
            'image-viewer': {
                beforeclose: this.beforeclose,
                afterrender: this.afterrender,
                resize: this.resize
            }
        });
    },

    //
    // TODO: Decouple by shifting to `tab-manager`!?
    //

    beforeclose: function (self) {
        var tab_manager = assert (self.up ('tab-manager'));
        if (tab_manager.items.getCount () == 1) {

            var curr = tab_manager;
            var next = curr.up ('panel');

            while (next && next.query ('tab-manager').length == 1) {
                curr = next; next = next.up ('panel');
            }

            var tab_managers = Ext.ComponentQuery.query ('tab-manager');
            if (tab_managers.length > 1) { curr.close (); return false; }
        }

        return true;
    },

    afterrender: function (self) {
        Webed.controller.panel.ImageViewer.center (self, 1);
    },

    resize: function (self) {
        Webed.controller.panel.ImageViewer.center (self, 1);
    },

    statics: {
        center: function (panel, ms, stop) {
            var cls = Webed.controller.panel.ImageViewer;

            if (ms && ms > 0) {
                Ext.defer (function () { cls.center (panel, 0, stop); }, ms);
            } else {
                var inner = panel.down ('box');
                if (inner || stop>=1) {
                    var outer = panel.body;
                    if (outer || stop>=2) {
                        var W = outer.getWidth ();
                        var H = outer.getHeight ();
                        var w = inner.getWidth ();
                        var h = inner.getHeight ();

                        if (w>0 && h>0 || stop>=3) {
                            var innerDx = (W - w) / 2.0;
                            var innerDy = (H - h) / 2.0;

                            inner.setPosition (innerDx, innerDy);
                        } else {
                            cls.center (panel, 10, 3);
                        }
                    } else {
                        cls.center (panel, 10, 2);
                    }
                } else {
                    cls.center (panel, 10, 1);
                }
            }
        }
    }
});
