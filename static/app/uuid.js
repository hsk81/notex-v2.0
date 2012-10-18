UUID = function () {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        .split('');

    function random (len, radix) {
        var chars = CHARS, uuid = [];
        radix = radix || chars.length;

        if (len) {
            for (var i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random () * radix];
        } else {
            var r;

            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for (var idx = 0; idx < 36; idx++) {
                if (!uuid[idx]) {
                    r = 0 | Math.random()*16;
                    uuid[idx] = chars[(idx == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join ('');
    }

    function fast () {
        var chars = CHARS, uuid = new Array(36), rnd=0, r;

        for (var i = 0; i < 36; i++) {
            if (i==8 || i==13 ||  i==18 || i==23) {
                uuid[i] = '-';
            } else if (i==14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }

        return uuid.join('');
    }

    function compact () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                var r = Math.random ()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString (16);
            })
            .toUpperCase();
    }

    function match (uuid) {
        return uuid.match (
            /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
        )
    }

    return {
        random: random,
        fast: fast,
        compact: compact,
        match: match
    }
}();
