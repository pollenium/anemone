import { Offer } from './Signal/Offer'
import { Bytes32, Uint256 } from 'pollenium-buttercup'
import { genTime } from '../utils/genTime'

export class OfferInfo {

  readonly offer: Offer;
  readonly clientId: Bytes32;
  private attemptsCount: number = 0
  private firstReceivedAt: number = genTime()
  private lastReceivedAt: number = genTime()
  private distance: Uint256

  constructor(struct: { offer: Offer, clientId: Bytes32 }) {
    this.offer = struct.offer
    this.clientId = struct.clientId
  }

  getAttemptsCount(): number {
    return this.attemptsCount
  }

  getFirstReceivedAgo(): number {
    return genTime() - this.firstReceivedAt
  }

  getLastReceivedAgo(): number {
    return genTime() - this.lastReceivedAt
  }

  incrementAttemptsCount(): void {
    this.attemptsCount += 1
  }

  updateLastReceivedAt(): void {
    this.lastReceivedAt = genTime()
  }

  getDistance(): Uint256 {
    if (this.distance) {
      return this.distance
    }
    const xor = this.offer.clientId.uu.genXor(this.clientId.uu)
    return new Uint256(xor)
  }
}
