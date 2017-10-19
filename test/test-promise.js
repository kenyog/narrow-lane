'use strict'

const test = require('ava');
const nl = require('../index.js');


/////////////////////////////////////////////////////////
// Promise Function tests

test( async function promise_function_test_for_parameter1(t) {
    var l = new nl.lane(1);

    function makeTestFunc(param) {
        return function() {
            param['this'] = this;
            param['args'] = Array.from(arguments);
            return Promise.resolve();
        }
    }

    var calledParam1 = {};
    var calledParam2 = {};
    var calledParam3 = {};
    var nt1 = l.narrowifyPromised(makeTestFunc( calledParam1 ));
    var nt2 = l.narrowifyPromised(makeTestFunc( calledParam2 ));
    var nt3 = l.narrowifyPromised(makeTestFunc( calledParam3 ));

    var p = [];
    p.push( nt1.apply("this1", ["a"] ) );
    p.push( nt2.apply("this2", ["b", "c"]) );
    p.push( nt3.apply("this3", ["d", "e", "f"]) );

    await Promise.all(p);

    t.deepEqual(calledParam1, {'this': "this1", 'args':["a"]});
    t.deepEqual(calledParam2, {'this': "this2", 'args':["b","c"]});
    t.deepEqual(calledParam3, {'this': "this3", 'args':["d","e","f"]});
});

test( async function promise_function_test_for_result1(t) {
    var l = new nl.lane(1);

    function makeTestFunc(ret) {
        return function() {
            return Promise.resolve(ret);
        }
    }

    var nt1 = l.narrowifyPromised(makeTestFunc( "ret1" ));
    var nt2 = l.narrowifyPromised(makeTestFunc( "ret2" ));
    var nt3 = l.narrowifyPromised(makeTestFunc( "ret3" ));

    var p = [];
    p.push( nt1.apply("this1", ["a"] ) );
    p.push( nt2.apply("this2", ["b", "c"]) );
    p.push( nt3.apply("this3", ["d", "e", "f"]) );

    var results = await Promise.all(p);
    t.deepEqual(results, ["ret1", "ret2", "ret3"]);
});

test( async function promise_function_test_for_result2(t) {
    var l = new nl.lane(1);

    function makeTestFunc(ret) {
        return function() {
            return Promise.reject(ret);
        }
    }

    var nt1 = l.narrowifyPromised(makeTestFunc( "except1" ));
    var nt2 = l.narrowifyPromised(makeTestFunc( "except2" ));
    var nt3 = l.narrowifyPromised(makeTestFunc( "except3" ));

    var p1 = nt1.apply("this1", ["a"] );
    var p2 = nt2.apply("this2", ["b", "c"]);
    var p3 = nt3.apply("this3", ["d", "e", "f"]);

    try { await p1 } catch(e) { t.is(e, "except1"); }
    try { await p2 } catch(e) { t.is(e, "except2"); }
    try { await p3 } catch(e) { t.is(e, "except3"); }
});




