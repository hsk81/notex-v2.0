function AssertException (message) {
    this.message = message;
}

AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
};

function assert (expression, message) {
    if (!expression) {
        throw new AssertException (message);
    } return expression;
}
