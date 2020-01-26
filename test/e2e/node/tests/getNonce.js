const utils = require('../utils')
const Uu = require('pollenium-uvaursi').Uu

const getMaxHash = utils.pollenium.utils.getMaxHash
const getNonce = utils.pollenium.utils.getNonce
const getNow = utils.pollenium.utils.getNow

const noncelessPrehash = Uu.genRandom(64)

describe('getNonce (non-worker)', () => {
  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    it(`difficulty:${difficulty}`, () => {
      getNonce(noncelessPrehash, difficulty, 69, 32, getNow() + 60)
    })
  }
})
