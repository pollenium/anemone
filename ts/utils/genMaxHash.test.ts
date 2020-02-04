/* globals test, expect */

import { Uint256 } from 'pollenium-buttercup'
import { genMaxHash } from './genMaxHash'

for (let difficulty = 0; difficulty <= 8; difficulty += 1) {
  test(`genMaxHash: difficulty: ${difficulty}`, () => {
    const maxHash = genMaxHash({
      difficulty,
      applicationDataLength: 69,
      cover: 32,
    })
    expect(maxHash).toBeInstanceOf(Uint256)
  })
}
