"use strict";

export default class FrameRunner {

  constructor(params){
    let defaults = {
      debug: false
    }
    this.options = Object.assign(defaults, params)

    this.counter = 0
    this.i = 0

    this.functionLookup = { everyFrame: {}, everySecond: {} }
    this.functionArray  = { everyFrame: [], everySecond: [] }

    this.polyfill()

    this.start()
  }

  start(){
    let context = this

    this.rafID = window.requestAnimationFrame(rafFunction)
    this.log('[frameRunner] start RAF Loop')

    function rafFunction(){
      context.rafID = window.requestAnimationFrame(rafFunction)

      for (context.i = context.functionArray.everyFrame.length - 1; context.i >= 0; context.i--)
        context.functionArray.everyFrame[context.i]()

      context.counter++
      if(context.counter>60) context.counter = 0

      if(context.counter === 0) {
        for (context.i = context.functionArray.everySecond.length - 1; context.i >= 0; context.i--)
          context.functionArray.everySecond[context.i]()
      }

    }

  }

  stop(){
    window.cancelAnimationFrame(this.rafID)
    this.log('[frameRunner] stop RAF Loop')
  }

  add(params){
    let options = {}

    // allow both types of function signature
    if(arguments.length > 1){
      options.id   = arguments[0]
      options.f    = arguments[1]
      options.type = arguments[2] || 'everyFrame'
    } else {
      let defaults = { id: null, f: null, type: 'everyFrame' }
      options = Object.assign(defaults, params)
    }

    if( !options.id || !options.f ) { this.error(`can’t add "${options.id}"; missing argument`); return }
    if( typeof options.f !== 'function') { this.error(`"${options.id}" is not a valid function`); return }

    if( ! this.functionLookup[ options.type ][ options.id ] ){
      this.log(`[frameRunner] adding "${options.id}" to ${options.type}`)

      this.functionLookup[ options.type ][ options.id ] = options.f
      this.functionArray[ options.type ].push(options.f)

      return this.remove.bind( null, options.id, options.type ) // return destroyer

    } else {
      this.error('[frameRunner] function exists')
    }
  }

  remove(params){
    let options = {}

    if(typeof arguments[0] === 'object'){
      let defaults = { id: undefined, type: 'everyFrame' }
      options = Object.assign(defaults, params)
    } else {
      options.id   = arguments[0]
      options.type = arguments[1] || 'everyFrame'
    }

    var theFunction = this.functionLookup[ options.type ][ options.id ];

    if( theFunction ){
      this.log(`[frameRunner] removing "${options.id}" from ${options.type}`);

      for (var i = this.functionArray[options.type].length - 1; i >= 0; i--) {
        if( this.functionArray[options.type][i] === theFunction ){
          this.functionArray[options.type].splice(i,1)
        }
      }

      delete this.functionLookup[ options.type ][ options.id ];
      return true;

    } else {
      this.error(`function "${name}" doesn’t exist`)
      return false;
    }
  }

  check(params){
    let options = {}

    if(typeof params === 'object'){
      let defaults = { id: undefined, type: 'everyFrame' }
      options = Object.assign(defaults, params)
    } else {
      options.id = arguments[0]
      options.type = arguments[1] || 'everyFrame'
    }

    return !! this.functionLookup[ options.type ][ options.id ]
  }

  getFrameCount(){ return this.rafID }

  log(){
    if(this.debug) console.log.call(null, arguments)
  }
  error(){
    if(this.debug) console.error.call(null, arguments)
  }

  // requestAnimationFrame() Polyfill
  // https://gist.github.com/paulirish/1579671
  polyfill(){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime()
        var timeToCall = Math.max(0, 16 - (currTime - lastTime))
        var id = window.setTimeout(function() { callback(currTime + timeToCall) }, timeToCall)
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) { clearTimeout(id); };
  }

}

