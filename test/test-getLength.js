'use strict'

const test = require('ava');
const nl = require('../index.js');

const util = require('util');
const timeout = util.promisify(setTimeout);


/////////////////////////////////////////////////////////
// Definition of stub functions for test.

function t1() { // simple promise function for test.
    return timeout(1);
}

function t1cb(cb) { // simple callback function for test.
    timeout(1).then( ()=> {
        cb(null, "ok");
    }).catch( (e) => {
        cb(e);
    });
}

/////////////////////////////////////////////////////////
// Method tests for getLength

test( async function methodtest_for_getLength1(t) {
    var l = new nl.lane(1);
    var nt1 = l.narrowifyPromised(t1);

    t.is(l.getLength(), 0);
    var p1 = nt1();
    t.is(l.getLength(), 1);
    var p2 = nt1();
    t.is(l.getLength(), 2);
    var p3 = nt1();
    t.is(l.getLength(), 3);

    await p1;
    t.is(l.getLength(), 2);
    await p2;
    t.is(l.getLength(), 1);
    await p3;
    t.is(l.getLength(), 0);
});

test( async function methodtest_for_getLength2(t) {
    var l = new nl.lane(1);
    var nt1 = l.narrowifyPromised(t1);
    var p = [];

    t.is(l.getLength(), 0);
    for ( let i=0; i<100; i++ )
    {
        p.push(nt1());
    }
    t.is(l.getLength(), 100);

    await Promise.all(p)
    t.is(l.getLength(), 0);
});

test.cb( function methodtest_for_getLength3(t) {
    var l = new nl.lane(1);
    var nt1cb = l.narrowifyCallbacker(t1cb);
    var count=0;

    t.is(l.getLength(), 0);
    for ( let i=0; i<100; i++ )
    {
        nt1cb( (err,msg) => {
            count++;
            if (count==100) {
                t.is(l.getLength(), 0);
                t.end();
            }
        });
    }
    t.is(l.getLength(), 100);
});

test( async function methodtest_for_getLength4(t) {
    async function innerTest(w) {
        var l = new nl.lane(w);
        var nt1 = l.narrowifyPromised(t1);
        var nt1cb = l.narrowifyCallbacker(t1cb);
        var pnt1cb = util.promisify(nt1cb);
        var p = [];

        t.is(l.getLength(), 0);
        for ( let i=0; i<100; i++ )
        {
            p.push(nt1());
            p.push(pnt1cb());
        }
        t.is(l.getLength(), 200);

        await Promise.all(p);
        t.is(l.getLength(), 0);
    }
    await innerTest(1);
    await innerTest(7);
    await innerTest(100);
    await innerTest(300);
});

