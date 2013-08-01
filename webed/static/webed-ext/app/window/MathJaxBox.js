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
        value: '$${{}}$$'
    },

    listeners: {
        beforerender: function (self) {
            var script = document.getElementById ('mjb-script.id');
            if (script == null) {
                script = document.createElement('script');
                script.id = 'mjb-script.id';
                script.type = 'text/javascript';
                script.src  =('https:' == document.location.protocol)
                    ? 'https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS_HTML'
                    : 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML';

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
        td.setHTML (this.getValue ());

        if (typeof MathJax != 'undefined') {
            if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                MathJax.Hub.Queue (['Typeset', MathJax.Hub, 'mjb-out.id']);
            }
        }
    }
});
