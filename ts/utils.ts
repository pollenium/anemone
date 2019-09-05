import { Bytes } from './classes/Bytes'
import * as freeice from 'freeice'
import * as Bn from 'bn.js'

export const stunServers = [
  // 'stun.l.google.com:19302',
  // 'stun1.l.google.com:19302',
  // 'stun2.l.google.com:19302',
  // 'stun3.l.google.com:19302',
  // 'stun4.l.google.com:19302',
  'global.stun.twilio.com:3478?transport=udp'
]



export function getNow() {
  return Math.floor((new Date).getTime() / 1000)
}

export function calculateEra(time: number) {
  return Math.floor(time / 60)
}

export function getSimplePeerConfig() {
  return {
    iceServers: stunServers.sort(() => {
      return Math.random() - .5
    }).slice(0, 2).map((stunServer) => {
      return {
        urls: `stun:${stunServer}`
      }
    })
  }

  const config = {
    iceServers: freeice({
      stunCount: 5
    })
  }
  return config
}

export function getTimestamp(): Bytes {
  return Bytes.fromNumber(getNow()).getPaddedLeft(5)
}

export function getNonce(noncelessPrehash: Bytes, difficulty: number, timeoutAt: number): Bytes {
  const noncelessPrehashLengthBn = new Bn(noncelessPrehash.getLength())
  const maxHashBn = getMaxHash(difficulty, noncelessPrehash.getLength() + 32).getBn()
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

export const twoBn = new Bn(2)

export function getMaxHash(difficulty: number, encodingLength: number): Bytes {
  const powBn = new Bn(256 - difficulty)
  const encodingLengthBn = new Bn(encodingLength)
  const maxHashBn = twoBn.pow(powBn).divRound(encodingLengthBn)
  return Bytes.fromBn(maxHashBn)
}
