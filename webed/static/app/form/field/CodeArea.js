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
        },

        getTypoEngine: function () {
            return Webed.form.field.CodeArea.typo_engine;
        },

        setTypoEngine: function (value) {
            Webed.form.field.CodeArea.typo_engine = value;
            Ext.ComponentQuery.query ('code-area').forEach (function (ca) {
                if (ca.spellChecker) {
                    ca.codemirror.removeOverlay (ca.spellChecker);
                    if (value) ca.codemirror.addOverlay (ca.spellChecker);
                }
            });
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

        if (this.needSpellChecker (this.getMime ())) {
            this.spellChecker = this.getSpellChecker ();
            editor.addOverlay (this.spellChecker);
        } else {
            this.spellChecker = null;
        }

        return editor;
    },

    needSpellChecker: function (mime) {
        switch (mime) {
            case 'text/plain':
            case 'text/x-rst':
            case 'text/x-markdown':
            case 'text/x-stex':
                return true;
            default:
                return false;
        }
    },

    getSpellChecker: function () {

        var rx_word_bas = "!\"'#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~";
        var rx_word_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿";
        var rx_word_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾";
        var rx_word_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎";
        var rx_word_xxx = "≈≡×";
        var rx_word = new RegExp ("^[^{0}{1}{2}{3}{4}\\d\\s]{2,}".format (
            rx_word_bas, rx_word_ext, rx_word_sup, rx_word_sub, rx_word_xxx
        ));

        return {
            token: function (stream) {

                if (stream.match (rx_word) &&
                    Webed.form.field.CodeArea.getTypoEngine () &&
                    !Webed.form.field.CodeArea.getTypoEngine ().check (
                        stream.current ()))

                    return "spell-error"; //CSS: cm-spell-error

                stream.next ();
                return null;
            }
        }
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
