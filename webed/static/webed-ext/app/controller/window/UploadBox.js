Ext.define ('Webed.controller.window.UploadBox', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    get_url: null, //@abstract
    get_root: null, //@abstract

    class_name: function (view) {
        return Ext.getClassName (view).split ('.').pop ()
    },

    get_value: function (view) {
        var value =  assert (view.down ('filefield[name=file]')).getValue ();
        // [text!plain] (0).zip|[text!plain](0).zip|[text!plain].zip|.zip|.txt
        var rx = /(?:\[(?:[^\]!]+)!(?:[^\]!]+)\])?(?:\s*\(\d+\))?\.(?:\w+)$/;
        var match = value.match (rx);

        return (match) ? match.pop () : undefined;
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    change: function (field) {
        var path = field.getValue ();
        if (path) {
            var last = path.lastIndexOf ('\\');
            if (last > -1) {
                var name = path.substring (last+1);
                field.setRawValue (name);
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    confirm: function () {
        var application = assert (this.application);
        var view = assert (this.getUploadBox ());
        var panel = assert (view.down ('form'));
        var form = assert (panel.getForm ());

        var class_name = this.class_name (view);
        var value = this.get_value (view);

        if (form.isValid ()) {
            form.submit ({
                url: this.get_url (),
                waitMsg: 'Uploading file ..',

                success: function () {
                    TRACKER.event ({
                        category: class_name, action: 'confirm',
                        label: value, value: 1
                    });

                    view.destroy ();
                    application.fireEvent ('refresh_tree');
                },

                failure: function () {
                    TRACKER.event ({
                        category: class_name, action: 'confirm',
                        label: value, value: 0
                    });

                    view.destroy ();
                    console.debug ('[UploadBox.confirmUpload]', 'failed');
                }
            });
        }
    },

    cancel: function () {
        var view = assert (this.getUploadBox ());

        TRACKER.event ({
            category: this.class_name (view), action: 'cancel',
            label:  this.get_value (view), value: 1
        });

        view.destroy ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
