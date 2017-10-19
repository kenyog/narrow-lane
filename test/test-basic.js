'use strict'

const test = require('ava');
const nl = require('../index.js');


test( function basic1(t) {
    var l = new nl.lane(10);
    t.is(l.width, 10);
    t.is(l.queue.length, 0);
});

