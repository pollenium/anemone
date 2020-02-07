import { Uint256 } from 'pollenium-buttercup'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { genMaxScore } from '../../src/utils/genMaxScore'

describe('genMaxScore', () => {
  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    describe(`difficulty: ${difficulty}`, () => {
      const MaxScore = genMaxScore({
        difficulty,
        applicationDataLength: 69,
        cover: 32,
      })
      it('should be instance of Uint256', () => {
        expect(MaxScore).to.be.instanceof(Uint256)
      })
    })
  }
})
