**Bower** `helios-frame-runner`

## rAF Manager

Bad things happen if you run multiple simultaneous `requestAnimationFrame` instances, so we’ve created this utility library for managing what happens in `rAF`.

Functions can be added and removed from one of two arrays: `everySecond` and `everyFrame`.

### How to Use

```
var rAF = new frameRunner();

rAF.start();

rAF.add('lots-of-calculation', 'everyFrame', lotsOfCalculation);

// later...
rAF.remove('lots-of-calculation', 'everyFrame');


```

### Methods

`start()`

`stop()`

`add(name, type, function)`

- `name`: string to identify your function so you can remove it again later
- `type`: `'everySecond'` or `'everyFrame'`
- `function`: the function you’d like run every second or frame

`remove(name, type)`

- `name`
- `type`: array to remove from
