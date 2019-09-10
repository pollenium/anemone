const utils = require('../js/utils')
const Bytes = require('../js/classes/Bytes').Bytes
const Bn = require('bn.js')

const getMaxHash = utils.getMaxHash
const getNonce = utils.getNonce
const getNow = utils.getNow


const noncelessPrehash = Bytes.random(32)

describe('getNonce', () => {
  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    it(`difficulty:${difficulty}`, () => {
      getNonce(noncelessPrehash, difficulty, getNow() + 30)
    })
  }
})
