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
        ssl: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js',
        url: 'http://cdn.mathjax.org/mathjax/latest/MathJax.js',
        cfg: 'TeX-AMS_HTML',
        value: '$${{}}$$'
    },

    statics: {
        queue: function (text, type) {
            var script = document.createElement('script');
            script.type = type||'text/x-mathjax-config';
            script.innerText = "MathJax.Hub.Queue (function () {"+text+"});";
            document.getElementsByTagName ('head')[0].appendChild (script);
        }
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
        function script (value) {
            return '<script type="math/tex; mode=display">{0}</script>'.format (
                value
            );
        }

        var td = assert (this.el.down ('td'));

        if (typeof MathJax != 'undefined' && MathJax && MathJax.Hub) {
            var jaxes = MathJax.Hub.getAllJax (td.id);
            if (jaxes.length > 0) {
                MathJax.Hub.Queue (['Text', jaxes[0], this.getValue ()]);
            } else {
                td.setHTML (script (this.getValue ()));
                MathJax.Hub.Queue (['Typeset', MathJax.Hub, td.id]);
            }
        } else {
            td.setHTML (script (this.getValue ()));
        }
    }
});
