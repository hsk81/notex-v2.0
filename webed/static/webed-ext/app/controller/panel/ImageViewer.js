Ext.define ('Webed.controller.panel.ImageViewer', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'image-viewer', ref: 'imageViewer'
    }],

    config: {
        delay: 1
    },

    init: function () {
        this.control ({
            'image-viewer': {resize: this.resize},
            'image-viewer image': {load: this.load}
        });
    },

    resize: function (viewer) {
        this.center (viewer, this.getDelay ());
    },

    load: function (image) {
        this.center (assert (image.up ('image-viewer')), this.getDelay ());
    },

    center: function (viewer, ms, stop) {
        var me = this;

        if (ms && ms > 0) {
            Ext.defer (function () { me.center (viewer, 0, stop); }, ms);
        } else {
            var inner = viewer.down ('box');
            if (inner || stop>=1) {
                var outer = viewer.body;
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
                        this.center (viewer, this.getDelay (), 3);
                    }
                } else {
                    this.center (viewer, this.getDelay (), 2);
                }
            } else {
                this.center (viewer, this.getDelay (), 1);
            }
        }
    }
});
