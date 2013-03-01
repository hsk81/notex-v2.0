importScripts ('../assert.js');
importScripts ('../../lib/typojs/typo/typo.js');

self.onmessage = function (event) {

    var args = event.data;
    assert (args.lingua);
    assert (args.charset);

    var aff = Typo.prototype.read_file (
        '/dictionaries/' + args.lingua + '.aff', args.charset
    );

    if (!aff) {
        self.postMessage (null);
        self.close ();
        return;
    }

    var dic = Typo.prototype.read_file (
        '/dictionaries/' + args.lingua + '.dic', args.charset
    );

    if (!dic) {
        self.postMessage (null);
        self.close ();
        return;
    }

    try {
        self.postMessage (new Typo (args.lingua, aff, dic));
    } catch (ex) {
        self.postMessage (null);
        throw ex;
    } self.close ();
};
