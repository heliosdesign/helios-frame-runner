import test from 'ava'
import createMockRaf from 'mock-raf'
let browserEnv = require('browser-env')


import FrameRunner from '../dist/frameRunner.umd.js'

test.before(t => {
  browserEnv()

  let mockRaf = createMockRaf()
  window.requestAnimationFrame = mockRaf.raf
})

test('exists', t => {
  t.truthy(FrameRunner)

  let frameRunner = new FrameRunner()
  t.truthy(frameRunner)

  t.truthy(typeof frameRunner.add === 'function')
})