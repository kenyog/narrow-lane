"use strict";

const util = require('util');

var narrow_lane = {
    lane: function(_width) {

        // public members.
        this.totalResolved = 0;
        this.totalRejected = 0;

        // private members.
        this.width = _width;
        this.runCount = 0;
        this.queue = [];
    }
};


narrow_lane.lane.prototype.promisify_narrower = function(func) {
    return this.narrower(util.promisify(func));
};

narrow_lane.lane.prototype.narrower = function(func) {
    var t = this;
    return ( function(arg) {
        let p = new Promise( (resolve,reject) => {
            let elm = {
                f: func,
                t: this,
                d: Array.from(arguments),
                rslv: resolve,
                rjct: reject
            };
            t.queue.push(elm);
        });
        t.checkAndRun();

        return p;
    });
};

narrow_lane.lane.prototype.checkAndRun = function() {
    if ( 0 < this.queue.length && this.runCount < this.width ) {
        let elm = this.queue.shift();

        elm.f.apply(elm.t, elm.d).then( (result) => {
            this.runCount--;
            this.checkAndRun();
            this.totalResolved++;
            elm.rslv(result);
        }).catch( (err) => {
            this.runCount--;
            this.checkAndRun();
            this.totalRejected++;
            elm.rjct(err);
        });;
        this.runCount++;
    }
};

narrow_lane.lane.prototype.getLength = function() {
    return (this.queue.length + this.runCount);
};

module.exports = narrow_lane;


