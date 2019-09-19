import { Bytes } from './classes/Bytes'
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

export function getTimestamp(): Bytes {
  return Bytes.fromNumber(getNow()).getPaddedLeft(5)
}

export const twoBn = new Bn(2)

export function getMaxHash(difficulty: number, encodingLength: number): Bytes {
  const powBn = new Bn(256 - difficulty)
  const encodingLengthBn = new Bn(encodingLength)
  const maxHashBn = twoBn.pow(powBn).divRound(encodingLengthBn)
  return Bytes.fromBn(maxHashBn)
}

export function getNonce(noncelessPrehash: Bytes, difficulty: number, timeoutAt: number): Bytes {
  const maxHashBn = getMaxHash(difficulty, noncelessPrehash.getLength() + 32).getBn()

  // eslint-disable-next-line no-constant-condition
  while(true) {
    if (getNow() > timeoutAt) {
      throw new Error('Timeout')
    }
    const nonce = Bytes.random(32)
    const prehash = noncelessPrehash.append(nonce)
    const hashBn = prehash.getHash().getBn()
    if (hashBn.lte(maxHashBn)) {
      return nonce
    }
  }
}
