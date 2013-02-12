///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Allows not only to bind *all* arguments (except last one), but it enables
 * actually to bind *any* consecutive, initial arguments.
 */

Function.prototype.curry = function () {
    var slice = Array.prototype.slice,
        args = slice.call (arguments),
        func = this;

    return function () {
        return func.apply (this, args.concat (slice.call (arguments)));
    };
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Allows to bind *any* argument using their names rather their position; this
 * approach is more flexible if initial arguments are to be left unbound.
 */

Function.prototype.partial = function () {
    var args = (arguments.length > 0) ? arguments[0] : {},
        negs = {},
        func = this;

    var str = func.toString (),
        lhs = str.indexOf ('(') + 1,
        rhs = str.indexOf (')'),
        names = str.slice (lhs, rhs).match (/([^\s,]+)/g);

    var i = 0; names.every (function (value) {
        if (value in args == false) negs[i++] = value; return true;
    });

    return function () {
        var union = [];
        for (var i in arguments)
            if (arguments.hasOwnProperty (i)) args[negs[i]] = arguments[i];
        for (var j in names)
            if (names.hasOwnProperty (j)) union.push (args[names[j]]);
        return func.apply (this, union);
    }
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var and = function (object, callback, scope) {
    for (var key in object) {
        if (object.hasOwnProperty (key)) {
            if (!callback.call (scope||this, key, object[key])) return false;
        }
    } return true;
};

var or = function (object, callback, scope) {
    for (var key in object) {
        if (object.hasOwnProperty (key)) {
            if (callback.call (scope||this, key, object[key])) return true;
        }
    } return false;
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function create_lock (ls) {
    var list = ls||[]; return {
        init: function (ls) { list = ls||[]; },
        empty: function () { return list.length == 0; },
        clear: function () { list = []; },
        push: function (el) { list.push (el); },
        pop: function () { return list.pop (); }
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function utf8Length (string) {
    return encodeURI (string).split (/%..|./).length - 1;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
