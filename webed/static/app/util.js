var and = function (object, callback, scope) {
    for (var key in object) {
        if (!callback.call (scope||this, key, object[key])) return false;
    } return true;
}

var or = function (object, callback, scope) {
    for (var key in object) {
        if (callback.call (scope||this, key, object[key])) return true;
    } return false;
}
