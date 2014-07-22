**Bower** `helios-frame-runner`

## rAF Manager

Running multiple simultaneous `requestAnimationFrame` calls is inefficient, so we’ve created this utility library for managing `rAF` functions, with some extra functionality as well.

The Helios Frame Runner supports two types of functions: `everySecond` and `everyFrame`. Of course, it includes an `rAF` polyfill.

### Development

You’ll need to run `npm install`. Edit `source/helios-frame-runner.js`. Running `gulp watch` will compile the versions you see in the root directory. 

`test/` is a simple mocha unit test. You’ll need to run `bower install` for its dependencies.

### How to Use

```
var frameRunner = new heliosFrameRunner()
```

Add a function to the manager:

```
var destroyer = frameRunner.add( 'functionId', 'everyFrame', function )
```

`add()` returns a destroyer function. You can call it to cleanly remove the function you added.

You can also remove that function by its ID:

```
frameRunner.remove('lots-of-calculation', 'everyFrame')
```

These two methods are functionally identical.

Now that you’ve added a function, start the `requestAnimationFrame` loop:

```
frameRunner.start()
```

And stop it again later:

```
frameRunner.stop()
```

Finally, you can get get a framecount as an integer using `frameRunner.frameCount()`.


### API

#### `start()`

#### `stop()`

#### `add( id, type, function )`

Returns: destroyer function

- `id`: string to identify your function so you can remove it again later
- `type`: `'everySecond'` or `'everyFrame'`
- `function`: the function you’d like run every second or frame

#### `remove( id, type )`

- `id`
- `type`: 'everySecond' or 'everyFrame'. Optional, omit to remove ID from both types.

