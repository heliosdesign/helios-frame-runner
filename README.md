**Bower** `helios-frame-runner`

# rAF Manager

Running multiple simultaneous `requestAnimationFrame` calls is inefficient, so we’ve created this utility library for managing `rAF` functions, with some extra functionality as well.

Of course, it includes an `rAF` polyfill.

#### v2 is not compatible with v1!

`add()` now takes arguments as an object.

v1: `frameRunner.add( 'functionID', 'everyFrame', function )`  
v2: `frameRunner.add({ id: 'functionID', function: function })`


## How to Use


Standalone: `var frameRunner = new heliosFrameRunner()`

Angular: `angular.module('yourApp', [ 'heliosFrameRunner' ]);`

### Adding and Removing Functions

Add a function to the manager:

```
frameRunner.add({ id: 'functionId', f: function })
```

`add()` automatically starts the `rAF` loop. If you don't want it to do this, add the option `autostart: false`.

You can verify that your function has been added to the framerunner by calling `check()`.

```
frameRunner.add({ id: 'sloths', f: slothsFunction })
frameRunner.check({ id: 'sloths' }) // returns true
```

`add()` returns a destroyer function, which you can call to remove the function you added.

```
var destroyer = frameRunner.add({ id: 'short-lived', f: function }

// later...
destroyer()

frameRunner.check({ id: 'short-lived' }) // => false
```

You can also remove that function by its ID:

```
frameRunner.remove({ id: 'short-lived' })
```

If all functions are removed from the frame runner, it will automatically call `cancelAnimationFrame`.



### Etc

You can manually start and stop the `rAF` loop:

```
frameRunner.start()
frameRunner.stop()
```

Framerunner will console log its actions if you set `frameRunner.debug = true`.

You can get get a framecount (as an integer) using `frameRunner.frameCount()`.


### API

#### `add( options {} )`

Add a function to the frame runner. Starts the rAF loop. Returns a destroyer function.

Options:

- `id`: string to identify your function
- `f`: the function you’d like run every second or frame
- `type`: *(optional, default everyFrame)* `'everySecond'` or `'everyFrame'`
- `autostart`: *(optional, default true)* start the `rAF` loop automatically

#### `remove( options {} )`

- `id`: string ID of function to remove
- `type`: *(optional, default everyFrame)* 'everySecond' or 'everyFrame'.

#### `check( id, type )`

- `id`: string ID of function to check
- `type`: *(optional, default everyFrame)* 'everySecond' or 'everyFrame'.

#### `start()`

Starts the `rAF` loop.

#### `stop()`

Stops the `rAF` loop.

#### `frameCount()`

Returns the frame count.




## Development

You’ll need to run `npm install`. Edit `source/helios-frame-runner.js`. Running `gulp watch` will compile the versions you see in the root directory. 
