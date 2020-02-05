import { Uint256 } from 'pollenium-buttercup'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { genMaxHash } from '../../src/utils/genMaxHash'

describe('genMaxHash', () => {
  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    describe(`difficulty: ${difficulty}`, () => {
      const maxHash = genMaxHash({
        difficulty,
        applicationDataLength: 69,
        cover: 32,
      })
      it('should be instance of Uint256', () => {
        expect(maxHash).to.be.instanceof(Uint256)
      })
    })
  }
})
