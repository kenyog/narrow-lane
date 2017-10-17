
const nlane = require('../');
const lookup = require('dns').lookup;


function test()
{
    var start = new Date;

    // make narrow-laned function `nlsleep` from the `sleep'.
    var lane = new nlane.lane(2);
    var nllookup = lane.narrowifyCallbacker(lookup);

    // call `lookup'
    nllookup('nodejs.org', (err, address) => {
        console.log('nodejs.org => %s ... %d msec', address, (new Date-start));
    });
    nllookup('github.com', (err, address) => {
        console.log('github.com => %s ... %d msec', address, (new Date-start));
    });
    nllookup('www.npmjs.com', (err, address) => {
        console.log('www.npmjs.com => %s ... %d msec', address, (new Date-start));
    });
    nllookup('travis-ci.org', (err, address) => {
        console.log('travis-ci.org => %s ... %d msec', address, (new Date-start));
    });
    nllookup('localhost', (err, address) => {
        console.log('localhost => %s ... %d msec', address, (new Date-start));
    });
};

test();

