"use strict";

var counter = 0;
var debug = false;

var running = false
var rafID // this also doubles as a frame count

var functionLookup = { everyFrame: {}, everySecond: {} }
var functionArray  = { everyFrame: [], everySecond: [] }

polyfill();

return {
  start: startRafLoop,
  stop:  stopRafLoop,

  add:    addFunction,
  remove: removeFunction,

  check: check,

  running:    isRunning,
  frameCount: getFrameCount,

  debug: debug,

}

// Extend defaults ********************************************************

function extend(){
  var output = {},
    args = arguments,
    l = args.length;

  for ( var i = 0; i < l; i++ )
    for ( var key in args[i] )
      if ( args[i].hasOwnProperty(key) )
        output[key] = args[i][key];
  return output;
}


// Debug ********************************************************

function log(msg){
  if(debug) console.log(msg);
}

function error(msg){
  if(debug) throw new Error(msg)
}

// Run Control ********************************************************

function startRafLoop(){
  if(running) return
  running = true
  rafID = window.requestAnimationFrame(rafFunction)
  log('[frameRunner] start RAF Loop')
}

function stopRafLoop(){
  if(!running) return
  running = false
  window.cancelAnimationFrame(rafID)
  log('[frameRunner] stop RAF Loop')
}


// Add/Remove Functions ********************************************************


function addFunction(opts){

  var defaults = {
    id: undefined,
    f: undefined,
    type: 'everyFrame',
    autostart: true
  }
  var options = extend(defaults,opts)

  if( !options.id || !options.f ) { error('can’t add "'+options.id+'"; missing argument'); return }
  if( typeof options.f !== 'function') { error('"'+options.id+'" is not a valid function'); return }

  if( ! functionLookup[ options.type ][ options.id ] ){

    log('[frameRunner] adding "'+options.id+'" to '+options.type);

    functionLookup[ options.type ][ options.id ] = options.f;
    functionArray[ options.type ].push(options.f);

    if(options.autostart) startRafLoop()

    return function(){ removeFunction( options.id, options.type ) } // return destroyer

  } else {
    error('[frameRunner] function exists')
  }
}

function removeFunction(opts){

  var defaults = {
    id: undefined,
    type: 'everyFrame',
    autostop: true
  }
  var options = extend(defaults,opts)

  var theFunction = functionLookup[ options.type ][ options.id ];

  if( theFunction ){
    log('[frameRunner] removing "'+options.id+'" from '+options.type);

    for (var i = functionArray[options.type].length - 1; i >= 0; i--) {
      if( functionArray[options.type][i] === theFunction ){
        console.log('REMOVING');
        functionArray[options.type].splice(i,1);
      }
    };

    delete functionLookup[ options.type ][ options.id ];

    // if there are no more active functions, stop the rAF loop as we don't need it any more
    if( options.autostop && ! functionArray.everyFrame.length && ! functionArray.everySecond.length )
      stopRafLoop()

  } else {
    error('function "'+name+'" doesn’t exist')
  }
}

function check(opts){

  var defaults = {
    id: undefined,
    type: 'everyFrame'
  }
  var options = extend(defaults,opts)

  return !! functionLookup[ options.type ][ options.id ]
}

// ********************************************************
// Main RAF Loop Function

function getFrameCount(){ return rafID }
function isRunning(){ return running }

function rafFunction(){

  rafID = requestAnimationFrame(rafFunction);

  counter++;
  if(counter>60) counter = 0;

  for (var i = functionArray.everyFrame.length - 1; i >= 0; i--)
    functionArray.everyFrame[i]();

  if(counter === 0) {
    for (var i = functionArray.everySecond.length - 1; i >= 0; i--)
      functionArray.everySecond[i]();
  }

}

// ********************************************************
// requestAnimationFrame() Polyfill
// https://gist.github.com/paulirish/1579671

function polyfill(){
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

