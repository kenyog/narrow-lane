
'use strict'

const test = require('ava');
const nl = require('../index.js');


/////////////////////////////////////////////////////////
// Callback Function tests

test.cb( function callback_function_test_for_parameter1(t) {
    var l = new nl.lane(1);

    function makeTestFunc(param) {
        return function() {
            var args = Array.from(arguments);
            var cb = args.pop();
            param['this'] = this;
            param['args'] = args;
            setTimeout(() => {
                cb(null, "ok");
            }, 1);
        }
    }

    var calledParam1 = {};
    var calledParam2 = {};
    var calledParam3 = {};
    var nt1cb = l.narrowifyCallbacker(makeTestFunc( calledParam1 ));
    var nt2cb = l.narrowifyCallbacker(makeTestFunc( calledParam2 ));
    var nt3cb = l.narrowifyCallbacker(makeTestFunc( calledParam3 ));

    nt1cb.apply("this1", ["a", () => {}] );
    nt2cb.apply("this2", ["b", "c", () => {}]);
    nt3cb.apply("this3", ["d", "e", "f", () => {
        t.deepEqual(calledParam1, {'this': "this1", 'args':["a"]});
        t.deepEqual(calledParam2, {'this': "this2", 'args':["b","c"]});
        t.deepEqual(calledParam3, {'this': "this3", 'args':["d","e","f"]});
        t.end();
    }]);
});

test.cb( function callback_function_test_for_result1(t) {
    var l = new nl.lane(1);

    function makeTestFunc() {
        var cb_param = Array.from(arguments);
        var cb_this = cb_param[0];
        cb_param[0] = undefined;
        return function() {
            var args = Array.from(arguments);
            var cb = args.pop();
            setTimeout(() => {
                cb.apply(cb_this, cb_param);
            }, 1);
        }
    }

    var nt1cb = l.narrowifyCallbacker(makeTestFunc( "this1", "a" ));
    var nt2cb = l.narrowifyCallbacker(makeTestFunc( "this2", "a", "b" ));
    var nt3cb = l.narrowifyCallbacker(makeTestFunc( "this3", "a", "b", "c" ));

    nt1cb(function() {
        t.is(this, "this1");
        t.deepEqual(Array.from(arguments), [undefined, "a"]);
    });
    nt2cb(function() {
        t.is(this, "this2");
        t.deepEqual(Array.from(arguments), [undefined, "a","b"]);
    });
    nt3cb(function() {
        t.is(this, "this3");
        t.deepEqual(Array.from(arguments), [undefined, "a","b","c"]);
        t.end();
    });
});

test.cb( function callback_function_test_for_result2(t) {
    var l = new nl.lane(1);

    function makeTestFunc(cb_this, cb_err) {
        return function() {
            var args = Array.from(arguments);
            var cb = args.pop();
            setTimeout(() => {
                cb.apply(cb_this, [cb_err]);
            }, 1);
        }
    }

    var nt1cb = l.narrowifyCallbacker(makeTestFunc("this1", "errA"));
    var nt2cb = l.narrowifyCallbacker(makeTestFunc("this2", "errB"));
    var nt3cb = l.narrowifyCallbacker(makeTestFunc("this3", "errC"));

    nt1cb(function(err) {
        t.is(this, "this1");
        t.is(err, "errA");
    });
    nt2cb(function(err) {
        t.is(this, "this2");
        t.is(err, "errB");
    });
    nt3cb(function(err) {
        t.is(this, "this3");
        t.is(err, "errC");
        t.end();
    });
});

