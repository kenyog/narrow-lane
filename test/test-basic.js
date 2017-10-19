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

test( function basic1(t) {
    var l = new nl.lane(10);
    t.is(l.width, 10);
    t.is(l.queue.length, 0);
});

