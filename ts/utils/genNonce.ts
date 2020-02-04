import { Uish, Uu } from 'pollenium-uvaursi'
import { Uintable, Uint256 } from 'pollenium-buttercup'
import * as shasta from 'pollenium-shasta'
import { genTime } from './genTime'
import { genMaxHash } from './genMaxHash'

export class TimeoutError extends Error {

  constructor() {
    super('genNonce Timeout')
  }

}

export function genNonce(struct: {
  noncelessPrehash: Uish;
  difficulty: Uintable;
  cover: Uintable;
  applicationDataLength: Uintable;
  timeoutAt: number;
}): Uint256 {
  const maxHash = genMaxHash(struct)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (genTime() > struct.timeoutAt) {
      throw new TimeoutError()
    }
    const nonce = Uu.genRandom(32)
    const prehash = Uu.genConcat([struct.noncelessPrehash, nonce])
    const hash = new Uint256(shasta.genSha256(prehash))
    if (hash.compLte(maxHash)) {
      return new Uint256(nonce)
    }
  }
}
