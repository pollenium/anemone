import { Uu } from 'pollenium-uvaursi'
import { genMaxHash } from './genMaxHash'
import { Uint256 } from 'pollenium-buttercup'

const noncelessPrehash = Uu.genRandom(64)

for (let difficulty = 0; difficulty <= 8; difficulty++) {
  test(`genMaxHash: difficulty: ${difficulty}`, () => {
    expect(
      genMaxHash({
        difficulty,
        applicationDataLength: 69,
        cover: 32,
      })
    ).toBeInstanceOf(Uint256)
  })
}
