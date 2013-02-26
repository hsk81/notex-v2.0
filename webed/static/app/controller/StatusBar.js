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
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {

        this.control ({
            'webed-statusbar-progressbar': {update: this.progress_update},
            'webed-statusbar-sizebutton': {click: this.size_click},
            'webed-statusbar-infobutton': {click: this.info_click},

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

    cursor: function (self, cursor) {
        var button = this.getInfoButton ();
        assert (button);

        if (cursor) {
            var text = '{0}:{1}'.format (cursor.line+1, cursor.ch+1);
            assert (text);

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
        var slider = this.getSlider ();
        assert (slider); slider.setValue (100);
    },

    info_click: function (self) {
        var viewport = self.up ('viewport');
        assert (viewport);
        var tabs = viewport.down ('content-tabs');
        assert (tabs);

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
        var viewport = self.up ('viewport');
        assert (viewport);
        var tabs = viewport.down ('content-tabs');
        assert (tabs);

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

        var size_button = this.getSizeButton ();
        assert (size_button); size_button.setText (value + '%');
        Ext.util.Cookies.set ('editor.font-size', value);
    },

    progress_update: function (self) {
        self.total += self.interval;
        var total = Ext.util.Format.number (self.total / 1000.0, '0.000');
        var text = Ext.String.format ('{0} .. {1} [s]', self.message, total);
        self.updateText (text);
    },

    progress_play: function (source, args) {
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

    progress_stop: function (source) {
        var progressbar = this.getProgressbar ();
        assert (progressbar);
        progressbar.reset (true);
        progressbar.setTotal (0);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
