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


narrow_lane.lane.prototype.checkAndRun = function() {
    if ( 0 < this.queue.length && this.runCount < this.width ) {
        let elm = this.queue.shift();

        if ( elm.c ) {
            let param = elm.d.concat( (err, result) => {
                if (err) this.totalRejected++;
                else this.totalRejected++;
                this.runCount--;
                elm.c.apply(this, [err, result]);
                this.checkAndRun();
            });
            elm.f.apply(elm.t, param);
        } else {
            elm.f.apply(elm.t, elm.d).then( (result) => {
                this.runCount--;
                this.totalResolved++;
                elm.rslv(result);
                this.checkAndRun();
            }).catch( (err) => {
                this.runCount--;
                this.totalRejected++;
                elm.rjct(err);
                this.checkAndRun();
            });;
        }
        this.runCount++;
    }
};

narrow_lane.lane.prototype.narrowifyCallbacker = function(func) {
    var t = this;
    return ( function(arg) {
        var ary = Array.from(arguments);
        var callback = ary.pop();
        var elm = {
            f: func,
            t: this,
            d: ary,
            c: callback
        };
        t.queue.push(elm);
        t.checkAndRun();
    });
};

narrow_lane.lane.prototype.narrowifyPromised = function(func) {
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

narrow_lane.lane.prototype.promisify_narrower = function(func) {
    return this.narrower(util.promisify(func));
};

narrow_lane.lane.prototype.getLength = function() {
    return (this.queue.length + this.runCount);
};

module.exports = narrow_lane;


