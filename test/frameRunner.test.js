import test from 'ava'
import createMockRaf from 'mock-raf'
let browserEnv = require('browser-env')

import FrameRunner from '../dist/frameRunner.umd.js'

let mockRaf

test.before(t => {
  browserEnv()
  mockRaf = createMockRaf()
  window.requestAnimationFrame = mockRaf.raf
})

test('instantiate', t => {
  t.truthy(FrameRunner)

  let frameRunner = new FrameRunner()
  t.truthy(frameRunner)

  t.truthy(typeof frameRunner.add === 'function')
})

test('add a function, argument style', t => {
  let frameRunner = new FrameRunner()

  let fn = function(){}
  frameRunner.add('fn', fn)

  t.is(frameRunner.functionArray.everyFrame[0], fn)
  t.is(frameRunner.functionLookup.everyFrame['fn'], fn)
})

test('add a function, object style', t => {
  let frameRunner = new FrameRunner()

  let fn = function(){}
  frameRunner.add({ id: 'fn', f: fn })

  t.is(frameRunner.functionArray.everyFrame[0], fn)
  t.is(frameRunner.functionLookup.everyFrame['fn'], fn)
})

test('remove a function, argument style', t => {
  let frameRunner = new FrameRunner()

  let fn = function(){}
  frameRunner.add('fn', fn)

  t.is(frameRunner.functionArray.everyFrame[0], fn)
  t.is(frameRunner.functionLookup.everyFrame['fn'], fn)

  let result = frameRunner.remove('fn')
  t.is(result, true)

  t.is(frameRunner.functionArray.everyFrame.length, 0)
  t.falsy(frameRunner.functionLookup.everyFrame['fn'])
})

test('remove a function, object style', t => {
  let frameRunner = new FrameRunner()

  let fn = function(){}
  frameRunner.add({ id: 'fn', f: fn })

  t.is(frameRunner.functionArray.everyFrame[0], fn)
  t.is(frameRunner.functionLookup.everyFrame['fn'], fn)

  let result = frameRunner.remove({ id: 'fn' })
  t.is(result, true)

  t.is(frameRunner.functionArray.everyFrame.length, 0)
  t.falsy(frameRunner.functionLookup.everyFrame['fn'])
})

test('check a function', t => {
  let frameRunner = new FrameRunner()

  t.is( frameRunner.check('asdf'), false )
  t.is( frameRunner.check({ id: 'asdf' }), false )

  let fn = function(){}
  frameRunner.add({ id: 'fn', f: fn })

  t.is( frameRunner.check('fn'), true )
  t.is( frameRunner.check({ id: 'fn' }), true )

  frameRunner.remove('fn')

  t.is( frameRunner.check('fn'), false )
  t.is( frameRunner.check({ id: 'fn' }), false )

})

test('run rAF', t => {
  let frameRunner = new FrameRunner()

  let total = 0
  let increment = function(){ total += 1 }

  frameRunner.add('increment', increment)

  mockRaf.step()
  t.is(total, 1)

  mockRaf.step({ count: 59 })
  t.is(total, 60)
})

test('run rAF (multiple functions)', t => {
  let frameRunner = new FrameRunner()

  let total = 0
  let increment = function(){ total += 2 }
  let decrement = function(){ total -= 1 }

  frameRunner.add('increment', increment)
  frameRunner.add('decrement', decrement)
  frameRunner.add('decrement2', decrement)

  mockRaf.step()
  t.is(total, 0)

  mockRaf.step({ count: 100 })
  t.is(total, 0)
})
