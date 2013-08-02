Ext.define ('Webed.controller.panel.TextEditor', {
    extend: 'Ext.app.Controller',

    refs: [{
        selector: 'text-editor', ref: 'textEditor'
    }],

    requires: [
        'Webed.window.ConfirmBox'
    ],

    init: function () {
        this.control ({
            'text-editor' : {
                afterlayout: this.afterlayout,
                activate: this.activate,
                beforeclose: this.beforeclose
            },

            'text-editor code-area': {
                blur: this.blur,
                change: this.change,
                clean: this.clean,
                cursor: this.cursor,
                focus: this.focus
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    afterlayout: function (self) {
        var tbar = assert (self.child ('toolbar'));
        var ca = assert (self.child ('code-area'));

        var height1 = self.getHeight ();
        assert (typeof (height1) == 'number');
        var height2 = tbar.getHeight ();
        assert (typeof (height2) == 'number');

        ca.setHeight (height1 - height2 - 2);
    },

    activate: function (self) {
        assert (self.child ('code-area')).focus (true, 125);
    },

    beforeclose: function (self) {
        var ca = assert (self.child ('code-area'));
        if (!ca.getClean ({fake: true})) {

            var record = assert (self.getRecord ());
            var name_path = assert (record.get ('name_path'));
            var value = assert (name_path.slice (1).join ('/'));
            var title = assert (record.getTitle ());
            var iconCls = assert (record.get ('iconCls'));

            var confirmBox = Ext.create ('Webed.window.ConfirmBox', {
                title: 'Close {0}?'.format (title),
                iconCls: iconCls,
                value: value,

                listeners: {
                    confirm: function (box) {
                        box.close ();
                        ca.setClean ({fake: true});
                        self.close ();
                    },
                    cancel: function (box) {
                        box.close ();
                    }
                }
            });

            confirmBox.show ();
            return false;
        } return true;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    focus: function (code_area) {
        var editor = assert (this.get_editor (code_area));
        editor.bubble (function (component) {
            component.fireEvent ('focus', component);
        });
    },

    blur: function (code_area) {
        var editor = assert (this.get_editor (code_area));
        editor.bubble (function (component) {
            component.fireEvent ('blur', component);
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    clean: function (code_area, opts) {
        if (opts && opts.fake) return; {
            var editor = assert (this.get_editor (code_area));
            editor.setTitle (editor.default_title);

            function editor_for (doc) {
                var codemirror = assert (doc.getEditor ());
                var editors = Ext.ComponentQuery.query ('text-editor');
                var editor = null;

                editors.every (function (ed) {
                    var ca = assert (ed.down ('code-area'));
                    if (ca.codemirror == codemirror) {
                        editor = ed; return false;
                    } return true;
                });

                return editor;
            }

            code_area.codemirror.iterLinkedDocs (function (doc) {
                var editor = editor_for (doc);
                if (editor) editor.setTitle (editor.default_title);
            });
        }
    },

    change: function (code_area) {
        var editor = assert (this.get_editor (code_area));
        if (editor.default_title == undefined) {
            editor.default_title = editor.title;
        }

        if (editor.default_title == editor.title) {
            editor.setTitle ('<i>{0}</i>'.format (editor.title));
        }
    },

    cursor: function (code_area, cursor) {
        var cm = assert (code_area.codemirror);

        /**
         * TODO: Shift `stex` detection to `RestTextEditor` since `TextEditor`
         *       is too generic for this rST/LaTex specialized functionality!
         */

        var mode = cm.getMode ();
        if (!mode || mode.name != 'rst') {
            return;
        }

        var mode_at = cm.getModeAt (cursor);
        if (mode_at && mode_at.name == 'stex') {

            var marks = cm.findMarksAt (cursor).filter (function (mark) {
                return mark.className == 'stex';
            });

            if (marks.length == 0) {
                var lhs = {ch: cursor.ch, line: cursor.line},
                    rhs = {ch: cursor.ch, line: cursor.line};

                var size = {
                    min: 0, max: cm.getLine (cursor.line).length
                };

                while (lhs.ch > size.min) {
                    var lhs_mode = cm.getModeAt (lhs);
                    if (lhs_mode.name != 'stex') break;
                    else lhs.ch -= 1;
                }

                while (rhs.ch < size.max) {
                    var rhs_mode = cm.getModeAt (rhs);
                    if (rhs_mode.name != 'stex') break;
                    else rhs.ch += 1;
                }

                marks = [cm.markText (lhs, rhs, {
                    className: 'stex' //CSS
                })];
            }

            assert (marks.length == 1);

            var position = marks[0].find ();
            if (position) {

                if (this.rx == undefined) {
                    this.rx = new RegExp ("math:`([^`]*)`|[^`]+");
                }

                var range = cm.getRange (position.from, position.to);
                var matches = range.match (this.rx);
                if (matches) {

                    var value =
                        (matches[1]) ? matches[1] :
                        (matches[2]) ? matches[2] : matches[0];

                    var mathjax_box = this.application.viewport.mjb;
                    if (mathjax_box && !mathjax_box.isDestroyed) {
                        mathjax_box.setValue (value).sync ();
                        mathjax_box.show ();
                    } else {
                        mathjax_box = Ext.create ('Webed.window.MathJaxBox', {
                            value: value
                        });

                        mathjax_box.show ();
                        mathjax_box.el.alignTo (this.application.viewport.el,
                            'br-br', [-25,-65]
                        );

                        var panel = mathjax_box.down ('panel');
                        assert (panel).setLoading (true);

                        if (window.chrome) {
                            Webed.window.MathJaxBox.queue (
                                "var viewport = Webed.app.viewport;" +
                                "var panel = viewport.mjb.down ('panel');" +
                                "assert (panel).setLoading (false);"
                            );
                        } else {
                            Ext.Function.defer (function (panel){
                                panel.setLoading (false);
                            }, 2750, this, [panel]);
                        }

                        this.application.viewport.mjb = mathjax_box;
                    }
                }
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_editor: function (code_area) {
        var editors = Ext.ComponentQuery.query ('text-editor');
        var editor = null;

        editors.every (function (ed) {
            var ca = assert (ed.down ('code-area'));
            if (ca == code_area) {
                editor = ed;
                return false;
            } return true;
        });

        return editor;
    }
});
