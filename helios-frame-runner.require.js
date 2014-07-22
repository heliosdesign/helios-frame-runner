define([], function(){

    
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
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var debug = false;
var log = function(msg){
    if(debug) console.log(msg);
}

// ********************************************************
var running = false;

var startRafLoop = function(){
	if(running) return;
	running = true;
	requestAnimationFrame(raf);
	log('[frameRunner] start RAF Loop');
}

var stopRafLoop = function(){
	if(!running) return;
	running = false;
	cancelAnimationFrame(raf);
	log('[frameRunner] stop RAF Loop');
}


// ********************************************************

var everyFrame  = {};
var everySecond = {};

var add = function(name, to, func){

	if( !name || !to || !func )
		throw new Error('missing argument')

	if( typeof func !== 'function')
		throw new Error('not a valid function')

	var arr = (to === 'everyFrame') ? everyFrame : everySecond;

	if(!arr[name]) {
		log('[frameRunner] adding "'+name+'" to '+to);
		arr[name] = func;

		// return destroyer
		return function(){ remove( name, to ) }

	} else {
		throw new Error('function exists') // function name already exists
	}
}

var remove = function(name, from){
	var arr

	if( typeof from === 'undefined' ){

		if( everyFrame[name] ) {
			log('[frameRunner] removing "'+name+'" from everyFrame');
			delete everyFrame[name]
		}

		if( everySecond[name] ){
			log('[frameRunner] removing "'+name+'" from everySecond');
			delete everySecond[name]
		}
		
	} else {

		arr = (from === 'everyFrame') ? everyFrame : everySecond;

		if(arr[name]) {
			log('[frameRunner] removing "'+name+'" from '+from);
			delete arr[name];
		}

	}
}

// ********************************************************
// Main RAF Loop Function

var frameCount = 0;

var getFrameCount = function(){
	return frameCount;
}

var counter = 0;
var raf = function(){

	requestAnimationFrame(raf);

	frameCount += 1;

	counter++;
	if(counter>60) counter = 0;

	// run all registered functions
	
	for (var func in everyFrame) {
		if (everyFrame.hasOwnProperty(func)) everyFrame[func]();
	}

	if(counter === 0) {
		for (var func in everySecond) {
			if (everySecond.hasOwnProperty(func)) everySecond[func]();
		}	
	}
	
}


// ********************************************************
return {
	start: startRafLoop,
	stop:  stopRafLoop,

	add:    add,
	remove: remove,

	debug: debug,

	frameCount: getFrameCount
}	


});