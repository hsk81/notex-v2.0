Ext.define ('Webed.controller.StatusBar', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'statusbar progressbar', ref: 'progressbar'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {

        this.control ({
            'webed-statusbar-progressbar' : {
                update: this.pb_update
            },
            'webed-statusbar-theme' : {
                select: function (combo, records, eOpts) {
                    var areas = Ext.ComponentQuery.query ('code-area');
                    areas.forEach (function (area) {
                        Ext.defer (function () {
                            area.codemirror.setOption ('theme', combo.getValue ().slice ());
                        }, 25);
                    });
                }
            }
        });

        this.application.on ({'progress-play': this.pb_play, scope: this});
        this.application.on ({'progress-stop': this.pb_stop, scope: this});
    },

    pb_update: function (self) {
        self.total += self.interval;
        var total = Ext.util.Format.number (self.total / 1000.0, '0.000');
        var text = Ext.String.format ('{0} .. {1} [s]', self.message, total);
        self.updateText (text);
    },

    pb_play: function (source, args) {
        var progressbar = this.getProgressbar ();
        assert (progressbar);
        if (progressbar.hidden) progressbar.show ();
        if (args.message) progressbar.setMessage (args.message);

        progressbar.setTotal (0);
        progressbar.wait ($.extend ({
            interval: progressbar.interval,
            increment: progressbar.increment
        }, args));
    },

    pb_stop: function (source) {
        var progressbar = this.getProgressbar ();
        assert (progressbar);
        progressbar.reset (true);
        progressbar.setTotal (0);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
