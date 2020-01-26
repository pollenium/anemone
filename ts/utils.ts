import { Uu, Uish } from 'pollenium-uvaursi'
import { Uint40, Uint256, Uintable } from 'pollenium-buttercup'
import * as shasta from 'pollenium-shasta'

export const stunServers = [
  'stun.l.google.com:19302',
  'stun1.l.google.com:19302',
  'stun2.l.google.com:19302',
  'stun3.l.google.com:19302',
  'stun4.l.google.com:19302',
  'global.stun.twilio.com:3478?transport=udp'
]



export function genNow(): number {
  return Math.floor((new Date).getTime() / 1000)
}

export function genEra(time: number): number {
  return Math.floor(time / 60)
}

export function genSimplePeerConfig() {
  // return {}
  return {
    iceServers: stunServers.sort(() => {
      return Math.random() - .5
    }).slice(0, 2).map((stunServer) => {
      return {
        urls: `stun:${stunServer}`
      }
    })
  }
}

export function genTimestamp(): Uint40 {
  return Uint40.fromNumber(genNow())
}

const two256 = Uint256.fromNumber(2)
const twofiftyfive256 = Uint256.fromNumber(255)

export function genMaxHash(struct: {
  difficulty: Uintable,
  cover: Uintable,
  applicationDataLength: Uintable
}): Uint256 {
  const difficulty = Uint256.fromUintable(struct.difficulty)
  const cover = Uint256.fromUintable(struct.cover)
  const applicationDataLength = Uint256.fromUintable(struct.applicationDataLength)

  const pow = twofiftyfive256.opSub(difficulty)
  const divisor = cover.opAdd(applicationDataLength)
  const maxHash = two256.opPow(pow).opDiv(divisor)
  return maxHash
}

export function genNonce(struct: {
  noncelessPrehash: Uish,
  difficulty: Uintable,
  cover: Uintable,
  applicationDataLength: Uintable,
  timeoutAt: number
}): Uint256 {
  const maxHash = genMaxHash({
    difficulty: struct.difficulty,
    cover: struct.cover,
    applicationDataLength: struct.applicationDataLength
  })

  // eslint-disable-next-line no-constant-condition
  while(true) {
    if (genNow() > struct.timeoutAt) {
      throw new Error('Timeout')
    }
    const nonce = Uu.genRandom(32)
    const prehash = Uu.genConcat([nonce, struct.noncelessPrehash])
    const hash = new Uint256(shasta.genSha256(prehash))
    if (hash.compLte(maxHash)) {
      return new Uint256(nonce)
    }
  }
}
