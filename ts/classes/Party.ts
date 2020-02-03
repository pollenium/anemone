import { IntrovertsGroup } from './FriendshipsGroup/IntrovertsGroup'
import { ExtrovertsGroup } from './FriendshipsGroup/ExtrovertsGroup'
import { Snowdrop } from 'pollenium-snowdrop'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'
import { Uu } from 'pollenium-uvaursi'
import { IPartialAnswer, IPartialOffer, IPartialFlush } from '../interfaces/Signal'
import delay from 'delay'
import { Bytes32, Uint256 } from 'pollenium-buttercup'
import { Primrose } from 'pollenium-primrose'
import { FriendshipsGroupSummary } from './FriendshipsGroup'
import { FRIENDSHIP_STATUS, DESTROY_REASON } from './Friendship'
import { $enum } from 'ts-enum-util'
import { genTime } from '../utils/genTime'
import { Missive } from './Missive'

class OfferInfo {

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

export class Party {

  private offerInfos: Array<OfferInfo> = []
  private isClientIdBanned : {[clientIdHex: string]: boolean } = {}

  private introvertsGroup: IntrovertsGroup = new IntrovertsGroup;
  private extrovertsGroup: ExtrovertsGroup = new ExtrovertsGroup;

  private introvertsGroupSummary: FriendshipsGroupSummary = new FriendshipsGroupSummary([]);
  private extrovertsGroupSummary: FriendshipsGroupSummary = new FriendshipsGroupSummary([]);

  private isBootstrapOffersComplete: boolean = false
  private friendshipOptions: { wrtc: any, missiveLatencyTolerance: number}

  readonly summarySnowdrop: Snowdrop<PartySummary> = new Snowdrop<PartySummary>();
  readonly partialAnswerSnowdrop: Snowdrop<IPartialAnswer> = new Snowdrop<IPartialAnswer>();
  readonly partialOfferSnowdrop: Snowdrop<IPartialAnswer> = new Snowdrop<IPartialAnswer>();
  readonly partialFlushSnowdrop: Snowdrop<IPartialFlush> = new Snowdrop<IPartialFlush>();

  constructor(private options: {
    maxFriendshipsCount: number,
    bootstrapOffersTimeout: number,
    maxOfferAttemptsCount: number
    wrtc: any,
    missiveLatencyTolerance: number,
    clientId: Bytes32
  }) {

    this.friendshipOptions = {
      wrtc: this.options.wrtc,
      missiveLatencyTolerance: this.options.missiveLatencyTolerance
    }


    this.extrovertsGroup.partialOfferSnowdrop.addHandle((partialOffer) => {
      this.partialOfferSnowdrop.emit(partialOffer)
    })
    this.introvertsGroup.partialAnswerSnowdrop.addHandle((partialAnswer) => {
      this.partialAnswerSnowdrop.emit(partialAnswer)
    })
    this.extrovertsGroup.partialFlushSnowdrop.addHandle((partialFlush) => {
      this.partialFlushSnowdrop.emit(partialFlush)
    })

    this.introvertsGroup.summarySnowdrop.addHandle((introvertsGroupSummary) => {
      this.introvertsGroupSummary = introvertsGroupSummary
      this.emitPartySummary()
    })
    this.extrovertsGroup.summarySnowdrop.addHandle((extrovertsGroupSummary) => {
      this.extrovertsGroupSummary = extrovertsGroupSummary
      this.emitPartySummary()
    })

    this.introvertsGroup.destroyedSnowdrop.addHandle(() => {
      this.maybeCreateFriendship()
    })
    this.extrovertsGroup.destroyedSnowdrop.addHandle(() => {
      this.maybeCreateFriendship()
    })

    this.introvertsGroup.banSnowdrop.addHandle((clientId) => {
      this.banClientId(clientId)
    })
    this.extrovertsGroup.banSnowdrop.addHandle((clientId) => {
      this.banClientId(clientId)
    })


    delay(options.bootstrapOffersTimeout * 1000).then(() => {
      this.isBootstrapOffersComplete = true
      for (let i = this.getFriendshipsCount(); i < options.maxFriendshipsCount; i++) {
        this.maybeCreateFriendship()
      }
    })

    setInterval(() => {
      this.clearOldOffers()
    }, 1000)
  }

  private clearOldOffers() {
    const now = genTime()
    this.offerInfos = this.offerInfos.filter((offerInfo) => {
      const lastReceivedAgo = offerInfo.getLastReceivedAgo()
      if (lastReceivedAgo <= 10) {
        return true
      } else {
        return false
      }
    })
  }

  private getBestConnectableOfferInfo(): OfferInfo | null {
    const peerClientIds = this.getPeerClientIds()

    const connectableOfferInfos = this.offerInfos.filter((offerInfo): boolean => {
      if (offerInfo.getAttemptsCount() >= this.options.maxOfferAttemptsCount) {
        return false
      }
      for (let i = 0; i < peerClientIds.length; i ++) {
        if (peerClientIds[i].uu.getIsEqual(offerInfo.offer.clientId.uu)) {
          return false
        }
      }
      return true
    })

    const sortedConnectableOfferInfos = connectableOfferInfos.sort((offerInfoA, offerInfoB): number => {

      if (!offerInfoA.offer.clientId.uu.getIsEqual(offerInfoB.offer.clientId)) {
        if (offerInfoA.getDistance() < offerInfoB.getDistance()) {
          return -1
        } else {
          return 1
        }
      }

      if (
        offerInfoA.getLastReceivedAgo() < offerInfoB.getLastReceivedAgo()
      ) {
        return -1
      } else if (
        offerInfoA.getLastReceivedAgo() > offerInfoB.getLastReceivedAgo()
      ) {
        return
      }
      if (
        offerInfoA.getAttemptsCount() < offerInfoB.getAttemptsCount()
      ) {
        return -1
      } else if (
        offerInfoA.getAttemptsCount() > offerInfoB.getAttemptsCount()
      ) {
        return 1
      }
      return 0
    })

    if (sortedConnectableOfferInfos.length === 0) {
      return null
    } else {
      return sortedConnectableOfferInfos[0]
    }
  }

  private maybeCreateFriendship(): void {
    if (this.getFriendshipsCount() >= this.options.maxFriendshipsCount) {
      this.maybeDestroyFriendship()
      return
    }
    const offerInfo = this.getBestConnectableOfferInfo()
    if (offerInfo) {
      offerInfo.incrementAttemptsCount()
      this.introvertsGroup.create(offerInfo.offer, this.friendshipOptions)
    } else if (this.isBootstrapOffersComplete) {
      this.extrovertsGroup.create(this.friendshipOptions)
    }
  }

  private maybeDestroyFriendship (): void {
    const offerInfo = this.getBestConnectableOfferInfo()
    if (offerInfo === null) {
      return
    }
    if (
      this.extrovertsGroup.getHasAnUnconnectedFriendship()
    ) {
      this.extrovertsGroup.destroyAnUnconnectedFriendship(DESTROY_REASON.NEW_OFFER)
      return
    }
    const worstPeerClientIdAndDistance = this.getWorstPeerClientIdAndDistance()
    if (worstPeerClientIdAndDistance === null) {
      return
    }
    const { peerClientId, distance } = worstPeerClientIdAndDistance
    if (offerInfo.getDistance().compLt(distance)) {
      this.destroyFriendshipWithPeerClientId(peerClientId, DESTROY_REASON.TOO_FAR)
    }
  }

  private getWorstPeerClientIdAndDistance(): { peerClientId: Bytes32, distance: Uint256 } | null {
    const peerClientIds = this.getPeerClientIds()
    if (peerClientIds.length === 0) {
      return null
    }
    const peerClientIdAndDistances: Array<{ peerClientId: Bytes32, distance: Uint256 }> =
      peerClientIds.map((peerClientId) => {
        return {
          peerClientId,
          distance: new Uint256(peerClientId.uu.genXor(this.options.clientId.uu))
        }
      }).sort((peerClientIdAndDistanceA, peerClientIdAndDistanceB) => {
        const distanceA = peerClientIdAndDistanceA.distance
        const distanceB = peerClientIdAndDistanceB.distance
        if (distanceA.compLt(distanceB)) {
          return -1
        }
        if (distanceA.compGt(distanceB)) {
          return 1
        }
        return 0
      })
    return peerClientIdAndDistances[0]
  }

  private destroyFriendshipWithPeerClientId(peerClientId: Bytes32, destroyReason: DESTROY_REASON): void {
    if (this.introvertsGroup.getHasFriendshipWithPeerClientId(peerClientId)) {
      this.introvertsGroup.destroyFriendshipWithPeerClientId(peerClientId, destroyReason)
      return
    }
    if (this.extrovertsGroup.getHasFriendshipWithPeerClientId(peerClientId)) {
      this.extrovertsGroup.destroyFriendshipWithPeerClientId(peerClientId, destroyReason)
      return
    }
    throw new Error('No friendship with that peerClientId')
  }

  private emitPartySummary(): void {
    this.summarySnowdrop.emit(this.getSummary())
  }

  getSummary(): PartySummary {
    return new PartySummary({
      introvertsGroupSummary: this.introvertsGroupSummary,
      extrovertsGroupSummary: this.extrovertsGroupSummary,
      offerInfos: this.offerInfos
    })
  }

  private getFriendshipsCount(): number {
    return this.introvertsGroup.getFriendshipsCount() + this.extrovertsGroup.getFriendshipsCount()
  }

  handleOffer(offer: Offer): void {
    if (this.isClientIdBanned[offer.clientId.uu.toHex()]) {
      return
    }
    const offerInfo = this.offerInfos.find((offerInfo) => {
      return offerInfo.offer.id.uu.getIsEqual(offer.id.uu)
    })
    if (offerInfo === undefined) {
      this.offerInfos.push(new OfferInfo({ offer, clientId: this.options.clientId }))
    } else {
      offerInfo.updateLastReceivedAt()
    }
    this.maybeCreateFriendship()
    this.emitPartySummary()
  }

  handleAnswer(answer: Answer): void {
    this.extrovertsGroup.handleAnswer(answer)
  }

  handleFlush(flush: Flush): void {
    this.offerInfos = this.offerInfos.filter((offerInfo) => {
      if (offerInfo.offer.id.uu.getIsEqual(flush.offerId)) {
        return false
      } else {
        return true
      }
    })
  }

  getPeerClientIds(): Array<Bytes32> {
    return [
      ...this.introvertsGroup.getPeerClientIds(),
      ...this.extrovertsGroup.getPeerClientIds()
    ]
  }

  broadcastMissive(missive: Missive): void {
    this.introvertsGroup.broadcastMissive(missive)
    this.extrovertsGroup.broadcastMissive(missive)
  }

  private banClientId(clientId: Bytes32) {
    this.isClientIdBanned[clientId.uu.toHex()] = true
    this.offerInfos = this.offerInfos.filter((offerInfo) => {
      return offerInfo.offer.clientId.uu.getIsEqual(clientId.uu)
    })
  }

}

export class PartySummary{

  readonly createdAt: number = genTime();

  constructor(private struct: {
    extrovertsGroupSummary: FriendshipsGroupSummary,
    introvertsGroupSummary: FriendshipsGroupSummary,
    offerInfos: Array<OfferInfo>
  }) {}

  getFriendshipsCount(): number {
    return (
      this.struct.extrovertsGroupSummary.getFriendshipsCount()
      +
      this.struct.introvertsGroupSummary.getFriendshipsCount()
    )
  }

  getFriendshipsCountByStatus(friendshipStatus: FRIENDSHIP_STATUS): number {
    return (
      this.struct.extrovertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus)
      +
      this.struct.introvertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus)
    )
  }

  getFriendshipsCountsByStatus(): { [status: number]: number }  {
    const friendshipsCountsByStatus: { [status: number]: number } = {}
    $enum(FRIENDSHIP_STATUS).forEach((status) => {
      friendshipsCountsByStatus[status] = this.getFriendshipsCountByStatus(status)
    })
    return friendshipsCountsByStatus
  }

  toJsonable() {
    return {
      createdAt: this.createdAt,
      createdAgo: genTime() - this.createdAt,
      friendshipsCount: this.getFriendshipsCount(),
      connectedFriendshipsCount: this.getFriendshipsCountsByStatus()['2'],
      offersCount: this.struct.offerInfos.length,
      offerInfos: this.struct.offerInfos.map((offerInfo) => {
       return {
         idHex: offerInfo.offer.id.uu.toHex(),
         offerClientIdHex: offerInfo.offer.clientId.uu.toHex(),
         attemptsCount: offerInfo.getAttemptsCount(),
         firstReceivedAgo: offerInfo.getFirstReceivedAgo(),
         lastReceivedAgo: offerInfo.getLastReceivedAgo(),
         distance: offerInfo.getDistance().uu.toHex()
        }
      }),
    friendshipsCountsByStatus: this.getFriendshipsCountsByStatus(),
    introvertsGroup: this.struct.introvertsGroupSummary.toJsonable(),
    extrovertsGroup: this.struct.extrovertsGroupSummary.toJsonable()
  }

}

  toJson(): string {
    return JSON.stringify(this.toJsonable(), null, 2)
  }

}
