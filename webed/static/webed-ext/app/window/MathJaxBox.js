Ext.define ('Webed.window.MathJaxBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.mathjax-box',

    requires: [
        'Ext.form.Panel'
    ],

    border: false,
    iconCls: 'icon-sum-16',
    height: 100,
    layout: 'fit',
    minHeight: 100,
    minWidth: 280,
    modal: false,
    resizable: true,
    title: 'Formula Preview',
    width: 280,

    items: [{
        id: 'mathjax-box.id',
        html: '<div class="mathjax-box">' +
            '<table><tr><td id="mjb-out.id">$${{}}$$</td></tr></table>' +
            '</div>'
    }],

    config: {
        ssl: 'https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js',
        url: 'http://cdn.mathjax.org/mathjax/latest/MathJax.js',
        cfg: 'TeX-AMS_HTML',
        value: '$${{}}$$'
    },

    listeners: {
        beforerender: function (self) {
            var script = document.getElementById ('mjb-script.id');
            if (script == null) {
                script = document.createElement('script');
                script.id = 'mjb-script.id';
                script.type = 'text/javascript';

                script.src  ='{0}?config={1}'.format (
                    ('https:' == document.location.protocol)
                        ? self.getSsl () : self.getUrl (), self.getCfg ()
                );

                document.getElementsByTagName ('head')[0].appendChild (script);
            }
        },

        afterrender: function (self) {
            self.sync ();
        },

        beforeclose: function (self) {
            self.hide (); return false;
        }
    },

    constructor: function (config) {
        this.initConfig (config);
        this.callParent (arguments);
    },

    sync: function () {
        var td = assert (this.el.down ('td'));
        td.setHTML ('<script type="math/tex; mode=display">{0}</script>'
            .format (this.getValue ())
        );

        /**
         * TODO: Re-render formula *only* if there was actually a change; since
         *       otherwise moving the cursor (in TextEditor) can be a little
         *       sluggish!
         *
         *       Test for something like `MathJax.getValue != this.getValue`
         *       and if different then re-render.
         */

        if (typeof MathJax != 'undefined') {
            if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                MathJax.Hub.Queue (['Typeset', MathJax.Hub, 'mjb-out.id']);
            }
        }
    }
});
