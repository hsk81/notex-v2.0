Ext.define ('Webed.form.field.CodeArea', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.code-area',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    config: {
        options: {
            autoClearEmptyLines: true,
            autofocus: true,
            direction: 'ltr',
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            mode: undefined,
            styleActiveLine: true,
            undoDepth: 99
        },

        mime: undefined
    },

    statics: {
        setHeight: function (value, ca) {
            if (ca && ca.id) {
                assert (ca.getEl ().down ('.CodeMirror')).setStyle (
                    'height', value + 'px'
                );
            } else {
                var ok = Ext.util.CSS.updateRule ('.CodeMirror',
                    'height', value + 'px'
                );
                if (!ok) Ext.query ('.CodeMirror').forEach (function (cm) {
                    cm.style['height'] = value + 'px'
                });
            }
        },

        setFontSize: function (value) {
            var ok = Ext.util.CSS.updateRule ('.CodeMirror',
                'font-size', value + '%'
            );
            if (!ok) Ext.query ('.CodeMirror').forEach (function (cm) {
                cm.style['font-size'] = value + '%'
            });
        },

        setDirection: function (value) {
            var ok = Ext.util.CSS.updateRule ('.CodeMirror pre',
                'direction', value
            );
            if (!ok) Ext.query ('.CodeMirror pre').forEach (function (pre) {
                pre.style['direction'] = value
            });
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
        },

        DMP: function () {
            if (Webed.form.field.CodeArea.dmp == undefined)
                Webed.form.field.CodeArea.dmp = new diff_match_patch ();
            return Webed.form.field.CodeArea.dmp;
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
                var options = assert (this.getOptions ());
                options.mode = modeInfo.mode;
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    mirror: function (ta) {

        var options = assert (this.getOptions ());
        var codemirror = CodeMirror.fromTextArea (ta, options);
        if (options.mode) CodeMirror.autoLoadMode (codemirror, options.mode);

        var mime = this.getMime ();
        if (mime) codemirror.setOption ('mode', mime);

        var me = this;
        codemirror.on ('cursorActivity', function (self) {
            me.fireEvent ('cursor', me, self.getCursor ());
        });
        codemirror.on ('focus', function (self) {
            me.fireEvent ('cursor', me, self.getCursor ());
            me.fireEvent ('focus', me);
        });
        codemirror.on ('blur', function (self) {
            me.fireEvent ('blur', me);
        });
        codemirror.on ('change', function (self, diff) {
            me.fireEvent ('change', me, diff);
        });

        if (this.needSpellChecker (this.getMime ())) {
            this.spellChecker = this.getSpellChecker ();
            codemirror.addOverlay (this.spellChecker);
        } else {
            this.spellChecker = null;
        }

        return codemirror;
    },

    link_to: function (that) {
        var doc = assert (that.codemirror.getDoc ());
        var lnk = assert (doc.linkedDoc ({sharedHist: true}));
        return assert (this.codemirror.swapDoc (lnk));
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    needSpellChecker: function (mime) {
        var store = assert (Ext.getStore ('MIMEs'));
        var record = assert (store.findRecord ('mime', mime));
        var flag = assert (record.get ('flag'));

        return flag['spell_check'];
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

    setValue: function (value, option) {
        if (this.codemirror) {
            this.codemirror.setValue (value);
        } else {
            if (this.inputEl && this.inputEl.dom) {
                this.codemirror = this.mirror (this.inputEl.dom);
                this.codemirror.setValue (value);
            } else {
                this.callParent (arguments);
            }
        }

        if (!option||option.sync!==false) {
            this.synchronize ();
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
        Webed.form.field.CodeArea.setHeight (value, this);
        this.updateLayout ();
    },

    setFontSize: function (value) {
        Webed.form.field.CodeArea.setFontSize (value, this);
        this.updateLayout ();
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    setClean: function (option) {

        if (!option||!option.fake) {
            if (this.codemirror) {
                this.codemirror.markClean ();
                this.fake_clean = undefined;
                this.fireEvent ('clean', this);
            } else {
                this.fake_clean = true;
                this.fireEvent ('clean', this, {fake: true});
            }
        } else {
            this.fake_clean = true;
            this.fireEvent ('clean', this, {fake: true});
        }

        if (!option||option.sync!==false) {
            this.synchronize ();
        }
    },

    getClean: function (option) {

        if (option && option.fake) {
            if (this.fake_clean !== undefined) {
                return this.fake_clean;
            }
        }

        if (this.codemirror) {
            return this.codemirror.isClean ();
        }

        return undefined;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    getDifference: function (variation) {
        var difference = null;

        var original = this.getOriginal ();
        if (original||original=='') {
            var dmp = Webed.form.field.CodeArea.DMP ();
            var patches = assert (dmp.patch_make (original, variation));
            difference = dmp.patch_toText (patches);
        }

        return difference;
    },

    getOriginal: function () {
        var original = null;

        if (this.codemirror) {
            var ta = assert (this.codemirror.getTextArea ());
            if (ta.value != null) {
                original = ta.value;
            } else {
                this.codemirror.iterLinkedDocs (function (doc) {
                    var editor = assert (doc.getEditor ());
                    var ta = assert (editor.getTextArea ());
                    if (ta.value != null) original = ta.value;
                });
            }
        }

        return original;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    synchronize: function () {
        if (this.codemirror) {
            var ta = assert (this.codemirror.getTextArea ());
            if (ta.value != null) {
                this.codemirror.save ();
            } else {
                this.codemirror.iterLinkedDocs (function (doc) {
                    var editor = assert (doc.getEditor ());
                    var ta = assert (editor.getTextArea ());
                    if (ta.value != null) editor.save ();
                });
            }
       }
    },

    onDestroy: function () {
        var lnk_list = []; this.codemirror.iterLinkedDocs (function (lnk) {
            lnk_list.push (lnk);
        });

        var ta_source = assert (this.codemirror.getTextArea ());
        if (ta_source.value != null) {
            var anchor = lnk_list.pop ();
            if (anchor) {
                var editor = assert (anchor.getEditor ());
                var ta = assert (editor.getTextArea ());
                ta.value = ta_source.value;
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    updateLayout: function () {
        if (this.codemirror) {
            this.codemirror.refresh ();
        } else {
            if (this.inputEl && this.inputEl.dom) {
                this.codemirror = this.mirror (this.inputEl.dom);
            } else {
                this.callParent (arguments);
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    focus: function (selectText, delay) {
        if (this.codemirror) {
            var me = this; Ext.defer (function () {
                me.codemirror.focus ();
            }, delay, this);
        } else {
            this.callParent (arguments);
        } return this;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
