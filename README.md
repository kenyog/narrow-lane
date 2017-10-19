# narrow-lane
node.js module for limitation of asynchronous process to be executed concurrently


# why this module?
The asynchronous programming model of node.js is very powerful and useful.
However, since many asynchronous processes can be easily executed simultaneously,
Performing some asynchronous process that uses a lot of memory may cause the system to become unstable.
(oops! OOM-killer!)

This module addresses such problems.
without changing the usage of the asynchronouse function,
It can limit the number of processes to be executed simultaneously.

# how to use?
You can install the module in your project.
```console
$ npm install narrow-lane
```

You can use it in 3 steps.
1. Import this module, and make `lane` object.
2. Make limited function from your function by a `narrowify` function of `lane` object.
   `lane` object is able to narrowify multiple functions on same lane.
3. You can use new limited function in the same manner as old one.


This is an example of limiting execution of asynchronous sleep function.
```javascript
  // STEP 1 import the module and make lane object.
  const nlane = require('narrow-lane');
  var lane = new nlane.lane(2);

  // define `sleep'.
  var start = new Date;
  function sleep(msg, time)
  {
      // print message, sleep {time}seconds and print message.
      console.log('%s before sleep at %d msec', msg, (new Date-start));
      return timeout(time*1000).then( () => {
          console.log('%s after sleep at %d msec', msg, (new Date-start));
      });
  }

  // STEP 2 make narrow-laned function `nlsleep` from the `sleep'.
  var nlsleep = lane.narrowifyPromised(sleep);

  // STEP 3 call `nlsleep' five times consecutively.
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
```

This example executes 2 sleep function at a time.
The output is below.
```
$ node example/example_sleep.js
A before sleep at 2 msec
B before sleep at 4 msec
A after sleep at 2008 msec
B after sleep at 2008 msec
C before sleep at 2008 msec
D before sleep at 2008 msec
C after sleep at 4010 msec
D after sleep at 4010 msec
E before sleep at 4010 msec
E after sleep at 6016 msec
finished. 
```


[![Build Status](https://travis-ci.org/kenyog/narrow-lane.svg?branch=master)](https://travis-ci.org/kenyog/narrow-lane)
