var message = function () {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    Ext.require ('Ext.window.MessageBox');

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function confirm_message (args) {
        var args = $.extend ({
            buttons: Ext.MessageBox.YESNO,
            iconCls: 'icon-question-16',
            minWidth: 256
        }, args);

        Ext.MessageBox.show (args);
    }

    function prompt_message (args) {
        var args = $.extend ({
            buttons: Ext.MessageBox.OKCANCEL,
            iconCls: 'icon-textfield-16',
            minWidth: 256,
            prompt: true
        }, args);

        Ext.MessageBox.show (args);
    }

    function error_message (args) {
        var args = $.extend ({
            buttons: Ext.Msg.OK,
            iconCls : 'icon-error-16',
            minWidth: 256,
            title : 'Error'
        }, args);

        Ext.MessageBox.show (args);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var resource = {
        INVALID_FILE: 'no file or invalid file type',
        LARGE_FILE: 'file size exceeds 512 KB',
        NO_REPORT: 'no report selected',
        NO_NEW_NODE: 'no new node created',
        NO_NODE: 'no node selected',
        MOVE_FAILED: 'moving failed',
        READ_ERROR: 'cannot read file',
        UNKNOWN_ERROR: 'unknown error',

        CREATE_ERROR: 'create error for <i>{0}</i>',
        READ_ERROR: 'read error for <i>{0}</i>',
        UPDATE_ERROR: 'update error for <i>{0}</i>',
        DELETE_ERROR: 'delete error for <i>{0}</i>'
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return $.extend (resource, {
        prompt: prompt_message,
        confirm: confirm_message,
        error: error_message
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
}();
