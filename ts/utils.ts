import { Buttercup } from 'pollenium-buttercup'
import Bn from 'bn.js'

export const stunServers = [
  'stun.l.google.com:19302',
  'stun1.l.google.com:19302',
  'stun2.l.google.com:19302',
  'stun3.l.google.com:19302',
  'stun4.l.google.com:19302',
  'global.stun.twilio.com:3478?transport=udp'
]



export function getNow(): number {
  return Math.floor((new Date).getTime() / 1000)
}

export function calculateEra(time: number): number {
  return Math.floor(time / 60)
}

export function getSimplePeerConfig() {
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

export function getTimestamp(): Buttercup {
  return Buttercup.fromNumber(getNow()).getPaddedLeft(5)
}

export const twoBn = new Bn(2)

export function getMaxHash(difficulty: number, cover: number, applicationDataLength: number): Buttercup {
  const powBn = new Bn(255 - difficulty)
  const divisor = new Bn(cover + applicationDataLength)
  const maxHashBn = twoBn.pow(powBn).divRound(divisor)
  return Buttercup.fromBn(maxHashBn)
}

export function getNonce(
  noncelessPrehash: Buttercup,
  difficulty: number,
  cover: number,
  applicationDataLength: number,
  timeoutAt: number
): Buttercup {
  const maxHashBn = getMaxHash(difficulty, cover, applicationDataLength).getBn()

  // eslint-disable-next-line no-constant-condition
  while(true) {
    if (getNow() > timeoutAt) {
      throw new Error('Timeout')
    }
    const nonce = Buttercup.random(32)
    const prehash = noncelessPrehash.append(nonce)
    const hashBn = prehash.getHash().getBn()
    if (hashBn.lte(maxHashBn)) {
      return nonce
    }
  }
}
