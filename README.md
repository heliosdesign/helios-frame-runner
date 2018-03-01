Running multiple simultaneous `requestAnimationFrame` loops causes a noticeable performance hit, so this utility manages multiple `rAF` functions while keeping your code clean and modular. It also includes an `rAF` polyfill.

## How to Use

```
let FrameRunner = require('helios-frame-runner')

let frameRunner = new FrameRunner()

frameRunner.add('draw', drawFunction)
frameRunner.add('draw2', drawFunction2)
```

All function accept two signatures:

```
frameRunner.add({ id: 'functionId', f: function, type: 'everySecond' })

frameRunner.remove({ id: 'functionId', f: function })

frameRunner.check({ id: 'functionId' })
```

is equal to

```
frameRunner.add('functionId', function, 'everySecond')

frameRunner.remove('functionId', function, 'everySecond')

frameRunner.check('functionId')
```

The `type` argument is optional in both signatures and defaults to `everyFrame`. The only other value for `type` at this time is `everySecond`, which will call the function once every sixty frames.


### Check

If you need to verify that a function has been added to the framerunner (ie to make something idempotent), call `check()`:

```
frameRunner.check({ id: 'myFunction', type: 'everyFrame' })

frameRunner.check('myFunction')
```

### Removing Functions

`add()` returns a destroyer function, which you can call to remove the function you added.

```
var destroyer = frameRunner.add({ id: 'short-lived', f: function })

destroyer()

frameRunner.check({ id: 'short-lived' }) // => false
frameRunner.check('short-lived') // => false
```

You can also remove that function by its ID:

```
frameRunner.remove({ id: 'short-lived' })
frameRunner.remove('short-lived')
```

### Etc

You can manually start and stop the `rAF` loop:

```
frameRunner.start()
frameRunner.stop()
```

Framerunner will console log all its actions if you pass `{ debug: true }` when instantiating it, ie

```
let frameRunner = new FrameRunner({ debug: true })
```

You can get a framecount (as an integer) using `frameRunner.frameCount()`.


## API

#### `add()`

`add({ id: '', function: f(), type: 'everyFrame' })`

`add( id, f, type )`

Add a function to the frame runner. Starts the rAF loop. Returns a destroyer function.

Options:

- `id`: string to identify your function
- `f`: the function you’d like run every second or frame
- `type`: *(optional, default everyFrame)* `'everySecond'` or `'everyFrame'`
- `autostart`: *(optional, default true)* start the `rAF` loop automatically

#### `remove()`

`remove({ id: '', function: f(), type: 'everyFrame' })`

`remove( id, f, type )`

- `id`: string ID of function to remove
- `type`: *(optional, default everyFrame)* 'everySecond' or 'everyFrame'.

#### `check()`

`check({ id: '', type: ''})`

`check( id, type )`

- `id`: string ID of function to check
- `type`: *(optional, default everyFrame)* 'everySecond' or 'everyFrame'.

#### `start()`

Starts the `rAF` loop.

#### `stop()`

Stops the `rAF` loop.

#### `frameCount()`

Returns the frame count.




## Development

Clone repo, run `npm install`. Edit `src/main.js`. Running `npm run build` will compile the versions you see in the root directory. `npm test` will run unit tests, using Ava.
