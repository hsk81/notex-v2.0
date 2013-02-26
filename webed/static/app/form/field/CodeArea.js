Ext.define ('Webed.form.field.CodeArea', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.code-area',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    config: {
        options: {
            autoClearEmptyLines: true,
            autofocus: true,
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            styleActiveLine: true
        }, mime: undefined
    },

    statics: {
        setHeight: function (value) {
            Ext.util.CSS.updateRule ('.CodeMirror', 'height', value + 'px');
        },

        setFontSize: function (value) {
            Ext.util.CSS.updateRule ('.CodeMirror', 'font-size', value + '%');
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    constructor: function (config) {
        this.callParent (arguments);
        this.initConfig (Ext.Object.merge (this.config, config||{}));

        var mime = this.getMime ();
        if (mime) {
            var modeInfos = CodeMirror.modeInfo.filter (function (mi) {
                return mi.mime == mime;
            });

            var modeInfo = modeInfos.pop ();
            if (modeInfo) {
                switch (modeInfo.mode) {
                    case 'yaml':
                        this.getOptions ().mode = 'yaml-plus'; break;
                    default:
                        this.getOptions ().mode = modeInfo.mode;
                }
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    mirror: function (ta, options) {
        var editor = CodeMirror.fromTextArea (ta, options);
        if (options.mode) CodeMirror.autoLoadMode (editor, options.mode);

        var me = this;
        editor.on ('cursorActivity', function (self) {
            me.fireEvent ('cursor', me, self.getCursor ());
        });
        editor.on ('focus', function (self) {
            me.fireEvent ('cursor', me, self.getCursor ());
        });
        editor.on ('blur', function (self) {
            me.fireEvent ('cursor', me, null);
        });

        return editor;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    setValue: function (value) {
        if (this.codemirror) {
            this.codemirror.setValue (value);
        } else {
            if (this.inputEl && this.inputEl.dom) {
                this.codemirror = this.mirror (
                    this.inputEl.dom, this.getOptions ()
                );
                this.codemirror.setValue (value);
            } else {
                this.callParent (arguments);
            }
        }
    },

    getValue: function () {
        if (this.codemirror) {
            return this.codemirror.getValue ();
        } else {
            return this.callParent (arguments);
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    setHeight: function (value) {
        Webed.form.field.CodeArea.setHeight (value);
        this.updateLayout ();
    },

    setFontSize: function (value) {
        Webed.form.field.CodeArea.setFontSize (value);
        this.updateLayout ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    updateLayout: function () {
        if (this.codemirror) {
            this.codemirror.refresh ();
        } else {
            if (this.inputEl && this.inputEl.dom) {
                this.codemirror = this.mirror (
                    this.inputEl.dom, this.getOptions ()
                );
            } else {
                this.callParent (arguments);
            }
        }
    },

    focus: function (selectText, delay) {
        if (this.codemirror) {
            Ext.defer (function () {
                this.codemirror.focus ();
            }, delay, this);
        } else {
            this.callParent (arguments);
        } return this;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
