var heliosFrameRunner = (function(){

    "use strict";

// ********************************************************
// requestAnimationFrame() Polyfill
// https://gist.github.com/paulirish/1579671

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime()
      ,   timeToCall = Math.max(0, 16 - (currTime - lastTime))
      ,   id = window.setTimeout(function() { callback(currTime + timeToCall); }
      ,   timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) { clearTimeout(id); };
}());

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

var debug = true;

var log = function(msg){
  if(debug) console.log(msg);
}

var error = function(msg){
  if(debug) throw new Error(msg)
}

// Run Control ********************************************************

var running = false
var rafID // this also doubles as a frame count

var startRafLoop = function(){
  if(running) return
  running = true
  rafID = window.requestAnimationFrame(rafFunction)
  log('[frameRunner] start RAF Loop')
}

var stopRafLoop = function(){
  if(!running) return
  running = false
  window.cancelAnimationFrame(rafID)
  log('[frameRunner] stop RAF Loop')
}


// Add/Remove Functions ********************************************************
 
var functions = { everyFrame: {}, everySecond: {} }
var functionCount = { everyFrame: 0, everySecond: 0 }

var addFunction = function(opts){

  var defaults = {
    id: undefined,
    f: undefined,
    type: 'everyFrame',
    autostart: true
  }
  var options = extend(defaults,opts)

  if( !options.id || !options.f ) { error('can’t add "'+options.id+'"; missing argument'); return }
  if( typeof options.f !== 'function') { error('"'+options.id+'" is not a valid function'); return }

  if( ! functions[ options.type ][ options.id ] ){

    log('[frameRunner] adding "'+options.id+'" to '+options.type);
    
    functions[ options.type ][ options.id ] = options.f;

    functionCount[options.type] += 1

    if( options.autostart ) startRafLoop()

    return function(){ removeFunction( options.id, options.type ) } // return destroyer

  } else {
    error('[frameRunner] function exists')
  }
}


var removeFunction = function(opts){

  var defaults = {
    id: undefined,
    type: 'everyFrame',
    autostop: true
  }
  var options = extend(defaults,opts)

  if( functions[ options.type ][ options.id ] ){
    log('[frameRunner] removing "'+options.id+'" from '+options.type);
    delete functions[ options.type ][ options.id ];
    functionCount[ options.type ] -= 1

    if( options.autostop && ! functionCount.everyFrame && ! functionCount.everySecond )
      stopRafLoop()

  } else {
    error('function "'+name+'" doesn’t exist')
  }
}

var check = function(opts){

  var defaults = {
    id: undefined,
    type: 'everyFrame'
  }
  var options = extend(defaults,opts)

  return !! functions[ options.type ][ options.id ]
}

// ********************************************************
// Main RAF Loop Function

var getFrameCount = function(){ return rafID }
var isRunning = function(){ return running }

var counter = 0;
var rafFunction = function(){

  rafID = requestAnimationFrame(rafFunction);

  counter++;
  if(counter>60) counter = 0;

  // everyFrame
  
  for (var func in functions.everyFrame) {
    if (functions.everyFrame.hasOwnProperty(func)) functions.everyFrame[func]();
  }

  // everySecond

  if(counter === 0) {
    for (var func in functions.everySecond) {
      if (functions.everySecond.hasOwnProperty(func)) functions.everySecond[func]();
    } 
  }
  
}


// ********************************************************
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


});
