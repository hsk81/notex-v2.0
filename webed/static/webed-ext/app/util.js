///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Allows not only to bind *all* arguments (except last one), but it enables
 * actually to bind *any* consecutive, initial arguments.
 */

if (!Function.prototype.curry) {
    Function.prototype.curry = function () {
        var slice = Array.prototype.slice,
            args = slice.call (arguments),
            func = this;

        return function () {
            return func.apply (this, args.concat (slice.call (arguments)));
        };
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Allows to bind *any* argument using their names rather their position; this
 * approach is more flexible if initial arguments are to be left unbound.
 */

if (!Function.prototype.partial) {
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
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * A simple implementation to format strings: E.g. `'{0}'.format ('alpha')`.
 */

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace (/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!String.format) {
    String.format = function () {

        var args = Array.prototype.slice.call (arguments);
        var self = args.shift ();

        return self.replace (/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

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
        pop: function (ask) {

            if (ask) {
                return list.pop () && this.empty ();
            } else {
                return list.pop ();
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function utf8Length (string) {
    return encodeURI (string).split (/%..|./).length - 1;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * string sprintf (string format , [mixed arg1 [, mixed arg2 [ ,...]]]);
 */

var sprintf = (function () {

    var repeat = function (value, times) {
        for (var output=[]; times>0; output[--times]=value) {}
        return output.join ('');
    };

    var rx0 = /^[^\x25]+/,
        rx1 = /^\x25{2}/,
        rx2 = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/,
        rx3 = /[^s]/,
        rx4 = /[def]/;

    return function () {
        var i=0, a, arg=arguments[i++], output=[], match, p, c, x, s='';

        while (arg) {
            if (match = rx0.exec (arg)) {
                output.push (match[0]);
            } else

            if (match = rx1.exec (arg)) {
                output.push ('%');
            } else

            if (match = rx2.exec (arg)) {

                if (((a=arguments[match[1]||i++]) == null)||(a == undefined)) {
                    throw ('insufficient arguments');
                }

                if (rx3.test (match[7]) && (typeof (a) != 'number')) {
                    throw ('invalid argument:' + typeof (a));
                }

                switch (match[7]) {
                    case 'b':
                        a = a.toString (2);
                        break;
                    case 'c':
                        a = String.fromCharCode (a);
                        break;
                    case 'd':
                        a = parseInt (a);
                        break;
                    case 'e':
                        a = match[6] ? a.toExponential (match[6])
                            : a.toExponential ();
                        break;
                    case 'f':
                        a = match[6] ? parseFloat (a).toFixed (match[6])
                            : parseFloat (a);
                        break;
                    case 'o':
                        a = a.toString (8);
                        break;
                    case 's':
                        a = ((a=String (a)) && match[6]
                            ? a.substring (0, match[6]) : a);
                        break;
                    case 'u':
                        a = Math.abs (a);
                        break;
                    case 'x':
                        a = a.toString (16);
                        break;
                    case 'X':
                        a = a.toString (16).toUpperCase ();
                        break;
                }

                a = (rx4.test (match[7]) && match[2] && a>=0 ? '+'+ a : a);
                c = match[3] ? match[3]=='0' ? '0' : match[3].charAt (1) : ' ';
                x = match[5] - String (a).length - s.length;
                p = match[5] ? repeat (c, x) : '';

                output.push(s + (match[4] ? a + p : p + a));
            }

            else {
                throw ('unknown error');
            }

            arg = arg.substring (match[0].length);
        }

        return output.join ('');
    }
})();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var TRACKER = function () {

    function _event (args) {
        if (_gaq && _gaq.push) {
            _gaq.push (['_trackEvent',
                args['category'],
                args['action'],
                args['label'],
                args['value'],
                args['flag']
            ]);
        }

        console.debug ('_event', args);
    }

    return {
        event: _event
    }
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
