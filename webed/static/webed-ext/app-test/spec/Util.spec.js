///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe ('Curry', function () {

    var Converter = function () {
        var converter = function (toUnit, factor, offset, input) {
            return { value: (((offset||0) + input) * factor), unit: toUnit };
        }

        return {
            inch2cm: converter.curry ('cm', 2.54, null),
            fh2c: converter.curry ('°C', 0.5556, -32)
        };
    }();

    it ('operator creates new function, e.g. inch2cm', function () {
        expect (Converter.inch2cm (3200)).toEqual ({
            value:8128, unit:'cm'
        });
    });

    it ('operator creates new function, e.g. fh2c', function () {
        expect (Converter.fh2c (95)).toEqual ({
            value:35.0028, unit:'°C'
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe ('Partial', function () {

    var Converter = function () {
        var converter = function (toUnit, factor, offset, input) {
            return { value: (((offset||0) + input) * factor), unit: toUnit };
        }

        return {
            fn0: converter.partial ({}),
            fn1: converter.partial ({toUnit:'cm'}),
            fn2: converter.partial ({toUnit:'cm', factor:2.54}),
            fn3: converter.partial ({toUnit:'cm', factor:2.54, offset:null}),
            fn4: converter.partial ({toUnit:'cm', factor:2.54, offset:null,
                input: 3200
            }),

            gn0: converter.partial ({}),
            gn1: converter.partial ({input: 3200}),
            gn2: converter.partial ({input: 3200, offset:null}),
            gn3: converter.partial ({input: 3200, offset:null, factor:2.54}),
            gn4: converter.partial ({input: 3200, offset:null, factor:2.54,
                toUnit:'cm'
            })
        };
    }();

    it ('operator creates new functions (initial args bound)', function () {
        expect (Converter.fn0 ('cm', 2.54, null, 3200)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.fn1 (      2.54, null, 3200)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.fn2 (            null, 3200)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.fn3 (                  3200)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.fn4 (                      )).toEqual ({
            value:8128, unit:'cm'
        });
    });

    it ('operator creates new functions (trailer args bound)', function () {
        expect (Converter.gn0 ('cm', 2.54, null, 3200)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.gn1 ('cm', 2.54, null)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.gn2 ('cm', 2.54)).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.gn3 ('cm')).toEqual ({
            value:8128, unit:'cm'
        });
        expect (Converter.gn4 ()).toEqual ({
            value:8128, unit:'cm'
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
