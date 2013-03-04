Ext.define ('Webed.controller.StatusBar', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    requires: [
        'Ext.util.Cookies'
    ],

    refs: [{
        selector: 'webed-statusbar-progressbar', ref: 'progressbar'
    },{
        selector: 'webed-statusbar-infobutton', ref: 'infoButton'
    },{
        selector: 'webed-statusbar-sizebutton', ref: 'sizeButton'
    },{
        selector: 'webed-statusbar-slider', ref: 'slider'
    },{
        selector: 'webed-statusbar', ref: 'statusbar'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {

        this.control ({
            'webed-statusbar-progressbar': {update: this.progress_update},
            'webed-statusbar-sizebutton': {click: this.size_click},
            'webed-statusbar-infobutton': {click: this.info_click},

            'webed-statusbar-lingua': {
                change: this.lingua_change,
                select: this.lingua_select
            },

            'webed-statusbar-slider': {
                change: this.slider_change,
                afterrender: this.slider_afterrender
            },

            'code-area': {
                cursor: this.cursor
            }
        });

        this.application.on ({
            'progress-play': this.progress_play, scope: this});
        this.application.on ({
            'progress-stop': this.progress_stop, scope: this});
    },

    lingua_change: function (self, newValue, oldValue) {
        if (oldValue && !newValue) {
            Webed.form.field.CodeArea.setTypoEngine (null);
            Webed.form.field.CodeArea.setDirection (null);
        }
    },

    lingua_select: function (self, records) {

        var controller = this;
        var statusbar = this.getStatusbar ();
        var record = assert (records.pop ());
        var lingua = assert (record.get ('lingua'));
        var charset = assert (record.get ('charset'));
        var name = assert (record.get ('name'));
        var direction = assert (record.get ('direction'));

        var worker_path = 'static/app/controller/StatusBar.worker.js';
        var worker = new Worker (worker_path);

        worker.onmessage = function (event) {
            clearTimeout (timeoutId);

            if (event.data && event.data.typo) {
                var typo_engine = Typo.prototype.load (event.data.typo);
                Webed.form.field.CodeArea.setTypoEngine (typo_engine);
                Webed.form.field.CodeArea.setDirection (direction);
            } else {
                self.reset (); statusbar.setStatus ({
                    text: 'Language: Enabling «{0}» failed!'.format (name),
                    clear: true
                });
            }

            controller.progress_stop (controller);
            self.enable ();
        };

        var timeoutId = setTimeout (function () {
            worker.onmessage ({data: {typo: null}});
            worker.terminate ();
        }, 60 * 1000);

        self.disable ();
        worker.postMessage ({lingua: lingua, charset: charset});
        this.progress_play (this, {message: 'Loading'});
    },

    cursor: function (self, cursor) {
        var button = assert (this.getInfoButton ());
        if (cursor) {
            var text = '{0}:{1}'.format (cursor.line+1, cursor.ch+1);
            if (button.getWidth () > button.minWidth) {
                button.setText (text);
            } else {
                button.suspendLayouts ();
                button.setText (text);
                button.resumeLayouts ();
            }
        }
    },

    size_click: function () {
        assert (this.getSlider ()).setValue (100);
    },

    info_click: function (self) {
        var viewport = assert (self.up ('viewport'));
        var tabs = assert (viewport.down ('content-tabs'));

        var tab = tabs.getActiveTab ();
        if (tab) {
            var ca = tab.down ('code-area');
            if (ca) {
                var value = ca.getValue ();
                if (value) {
                    self.disable ();
                    var lines = value.split (/\n/).length;
                    var words = value.split (/\s+[^\s+$]/).length;
                    var chars = value.length;

                    self.setText (String.format ('{0}:{1}:{2}',
                        lines, words, chars
                    ));

                    self.enable ();
                } else {
                    self.setText ('1:0:0');
                }
            }
        }
    },

    slider_afterrender: function (self) {
        var value = Ext.util.Cookies.get ('editor.font-size');
        if (value) self.setValue (value, false);
    },

    slider_change: function (self, value) {
        var viewport = assert (self.up ('viewport'));
        var tabs = assert (viewport.down ('content-tabs'));

        var tab = tabs.getActiveTab ();
        if (tab) {
            var ca = tab.down ('code-area');
            if (ca) {
                ca.setFontSize (value);
            } else {
                Webed.form.field.CodeArea.setFontSize (value);
            }
        } else {
            Webed.form.field.CodeArea.setFontSize (value);
        }

        assert (this.getSizeButton ()).setText (value + '%');
        Ext.util.Cookies.set ('editor.font-size', value);
    },

    progress_update: function (self) {
        self.total += self.interval;
        var total = Ext.util.Format.number (self.total / 1000.0, '0.000');
        var text = Ext.String.format ('{0} .. {1} [s]', self.message, total);
        self.updateText (text);
    },

    progress_play: function (source, args) {
        var progressbar = assert (this.getProgressbar ());
        if (progressbar.hidden) progressbar.show ();
        if (args.message) progressbar.setMessage (args.message);

        progressbar.setTotal (0);
        progressbar.wait ($.extend ({
            interval: progressbar.interval,
            increment: progressbar.increment
        }, args));
    },

    progress_stop: function (source) {
        var progressbar = assert (this.getProgressbar ());
        progressbar.reset (true);
        progressbar.setTotal (0);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
