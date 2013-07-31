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
        html: '<div style="height: 100%; width: 100%;">' +
            '<table style="height: 100%; width: 100%;">' +
            '<tr><td style="text-align: center;" id="mjb-out.id">$${{}}$$</td></tr>' +
            '</table>' +
            '</div>'
    }],

    config: {
        value: '$${{}}$$'
    },

    listeners: {
        afterrender: function (self) {
            var script = document.getElementById ('MathJax.script.id');
            if (script == null) {
                script = document.createElement('script');
                script.id = 'MathJax.script.id';
                script.type = 'text/javascript';
                script.src  = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML';
                document.getElementsByTagName ('head')[0].appendChild (script);
            }

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
