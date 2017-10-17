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


This is an example of limiting execution of execFile.
```javascript
var lane = new nlane.lane(2);
var nlexecFile = lane.promisify_narrower(cp.execFile);

p = [];
p[0] = nlexecFile('sleep', ['5']);
p[1] = nlexecFile('sleep', ['5']);
p[2] = nlexecFile('sleep', ['5']);
p[3] = nlexecFile('sleep', ['5']);
p[4] = nlexecFile('sleep', ['5']);

try {
    var result = await Promise.all(p);
    return result;
} catch (e) {
    return e;
}
```
This example limits the execution of execFile function to 2 asynchronous processes.
so the program takes 15 seconds.
