(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.frameRunner = factory());
}(this, (function () { 'use strict';

class FrameRunner {

  constructor(params) {
    let defaults = {
      debug: false
    };
    this.options = Object.assign(defaults, params);

    this.counter = 0;
    this.i = 0;

    this.functionLookup = { everyFrame: {}, everySecond: {} };
    this.functionArray = { everyFrame: [], everySecond: [] };

    this.polyfill();

    this.start();
  }

  start() {
    this.rafID = window.requestAnimationFrame(this.rafFunction);
    this.log('[frameRunner] start RAF Loop');
  }

  stop() {
    window.cancelAnimationFrame(this.rafID);
    this.log('[frameRunner] stop RAF Loop');
  }

  add(params) {
    let options = {};

    // allow both types of function signature
    if (arguments.length > 1) {
      options.id = arguments[0];
      options.f = arguments[1];
      options.type = arguments[2];
    } else {
      let defaults = { id: null, f: null, type: 'everyFrame' };
      options = Object.assign(defaults, params);
    }

    if (!options.id || !options.f) {
      this.error(`can’t add "${options.id}"; missing argument`);return;
    }
    if (typeof options.f !== 'function') {
      this.error(`"${options.id}" is not a valid function`);return;
    }

    if (!this.functionLookup[options.type][options.id]) {
      this.log(`[frameRunner] adding "${options.id}" to ${options.type}`);

      this.functionLookup[options.type][options.id] = options.f;
      this.functionArray[options.type].push(options.f);

      return removeFunction.bind(null, options.id, options.type); // return destroyer
    } else {
      this.error('[frameRunner] function exists');
    }
  }

  remove(params) {
    let defaults = { id: undefined, type: 'everyFrame' };
    let options = Object.assign(defaults, params);

    var theFunction = this.functionLookup[options.type][options.id];

    if (theFunction) {
      this.log(`[frameRunner] removing "${options.id}" from ${options.type}`);

      for (var i = this.functionArray[options.type].length - 1; i >= 0; i--) {
        if (this.functionArray[options.type][i] === theFunction) {
          this.functionArray[options.type].splice(i, 1);
        }
      }

      delete this.functionLookup[options.type][options.id];
    } else {
      this.error(`function "${name}" doesn’t exist`);
    }
  }

  removeAll() {
    this.functionLookup = { everyFrame: {}, everySecond: {} };
    this.functionArray = { everyFrame: [], everySecond: [] };
  }

  check(params) {
    let options = Object.assign(params);
    return !!this.functionLookup[options.type][options.id];
  }

  getFrameCount() {
    return this.rafID;
  }

  rafFunction() {
    this.rafID = requestAnimationFrame(this.rafFunction);

    for (this.i = this.functionArray.everyFrame.length - 1; this.i >= 0; this.i--) this.functionArray.everyFrame[this.i]();

    this.counter++;
    if (this.counter > 60) this.counter = 0;

    if (this.counter === 0) {
      for (this.i = this.functionArray.everySecond.length - 1; this.i >= 0; this.i--) this.functionArray.everySecond[this.i]();
    }
  }

  log() {
    if (this.debug) console.log.call(null, arguments);
  }
  error() {
    if (this.debug) console.error.call(null, arguments);
  }

  // requestAnimationFrame() Polyfill
  // https://gist.github.com/paulirish/1579671
  polyfill() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

}

return FrameRunner;

})));
