Ext.define ('Webed.controller.panel.ImageViewer', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'image-viewer', ref: 'imageViewer'
    }],

    init: function () {
        this.control ({
            'image-viewer' : {
                beforeclose: this.beforeclose,
                resize: this.resize
            }
        });
    },

    beforeclose: function (self) {
        console.debug ('[before-close]', self); // TODO: W.r.t. `TabManager`!
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
