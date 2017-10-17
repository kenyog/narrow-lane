
const util = require('util');
const nlane = require('../');
const timeout = util.promisify(setTimeout);



function test1()
{
    var start = new Date;

    // define `sleep'.
    function sleep(msg, time)
    {
        // print message, sleep {time}seconds and print message.
        console.log('%s before sleep at %d msec', msg, (new Date-start));
        return timeout(time*1000).then( () => {
            console.log('%s after sleep at %d msec', msg, (new Date-start));
        });
    }

    // make narrow-laned function `nlsleep` from the `sleep'.
    var lane = new nlane.lane(2);
    var nlsleep = lane.narrowifyPromised(sleep);

    // call `nlsleep' five times consecutively.
    var p = [];
    p[0] = nlsleep("A", 2);
    p[1] = nlsleep("B", 2);
    p[2] = nlsleep("C", 2);
    p[3] = nlsleep("D", 2);
    p[4] = nlsleep("E", 2);

    // wait all asynchronous process.
    Promise.all(p).then((result) => {
        console.log(`finished. `);
    }).catch((e) => {
        console.log(`error: ${e}`);
    });
};

test1();

