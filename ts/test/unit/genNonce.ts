import { Uu } from 'pollenium-uvaursi'
import { Uint256 } from 'pollenium-buttercup'
import { describe, it } from 'mocha'
import { expect } from 'chai'

import { genTime } from '../../src/utils/genTime'
import { genNonce } from '../../src/utils/genNonce'

const noncelessPrehash = Uu.genRandom(64)

describe('genNonce', () => {
  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    describe(`difficulty: ${difficulty}`, () => {
      it('should generate nonce', () => {
        const nonce = genNonce({
          noncelessPrehash,
          difficulty,
          applicationDataLength: 69,
          cover: 32,
          timeoutAt: genTime() + 60,
        })
        expect(nonce).to.be.instanceof(Uint256)
      })
    })
  }
})
