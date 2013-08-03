Ext.define ('Webed.controller.panel.RestTextEditor', {
    extend: 'Webed.controller.panel.TextEditor',

    refs: [{
        selector: 'rest-text-editor', ref: 'textEditor'
    }],

    init: function () {
        this.control ({
            'rest-text-editor code-area': {
                cursor: this.cursor
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    cursor: function (code_area, cursor) {

        var cm = assert (code_area.codemirror);
        var mode_at = cm.getModeAt (cursor);
        if (!mode_at || mode_at.name != 'stex') {
            return;
        }

        function get_marks (cm) {
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

            return marks;
        }

        function show_box (mark) {
            var position = mark.find ();
            if (!position) return;

            if (this.rx == undefined) {
                this.rx = new RegExp ('[^`]+');
            }

            var range = cm.getRange (position.from, position.to);
            var matches = range.match (this.rx);
            if (!matches) return;

            var value = ((matches[1]) ? matches[1] :
                (matches[2]) ? matches[2] : matches[0])
                    .replace ('&=', '=').replace ('&\\', '\\');

            var mathjax_box = this.application.viewport.mjb;
            if (mathjax_box && !mathjax_box.isDestroyed) {
                mathjax_box.setValue (value).sync ();
                mathjax_box.show ();
            } else {
                mathjax_box = Ext.create ('Webed.window.MathJaxBox', {
                    value: value
                });

                mathjax_box.show();
                mathjax_box.el.alignTo (this.application.viewport.el,
                    'br-br', [-25, -65] //bottom right corner
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
                    Ext.Function.defer (function (panel) {
                        panel.setLoading (false); //FF workaround!
                    }, 5000, this, [panel]);
                }

                this.application.viewport.mjb = mathjax_box;
            }
        }

        var marks = get_marks.call (this, cm);
        assert (marks.length > 0);
        show_box.call (this, marks[0]);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
