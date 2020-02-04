/* globals test, expect */

import { Uu } from 'pollenium-uvaursi'
import { Uint256 } from 'pollenium-buttercup'
import { genTime } from './genTime'
import { genNonce } from './genNonce'

const noncelessPrehash = Uu.genRandom(64)

for (let difficulty = 0; difficulty <= 8; difficulty++) {
  test(`genNonce (non-worker): difficulty: ${difficulty}`, () => {
    const nonce = genNonce({
      noncelessPrehash,
      difficulty,
      applicationDataLength: 69,
      cover: 32,
      timeoutAt: genTime() + 60,
    })
    expect(nonce).toBeInstanceOf(Uint256)
  })
}
