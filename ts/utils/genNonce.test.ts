import { Uu } from 'pollenium-uvaursi'
import { genTime } from './genTime'
import { genNonce } from './genNonce'
import { Uint256 } from 'pollenium-buttercup'

const noncelessPrehash = Uu.genRandom(64)

for (let difficulty = 0; difficulty <= 8; difficulty++) {
  test(`genNonce (non-worker): difficulty: ${difficulty}`, () => {
    expect(
      genNonce({
        noncelessPrehash,
        difficulty,
        applicationDataLength: 69,
        cover: 32,
        timeoutAt: genTime() + 60
      })
    ).toBeInstanceOf(Uint256)
  })
}
