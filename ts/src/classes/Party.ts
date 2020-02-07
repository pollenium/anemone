import { Snowdrop } from 'pollenium-snowdrop'
import delay from 'delay'
import { Bytes32, Uint256 } from 'pollenium-buttercup'
import { IntrovertsGroup } from './FriendshipsGroup/IntrovertsGroup'
import {
  ExtrovertsGroup,
  ExtrovertsGroupStruct,
} from './FriendshipsGroup/ExtrovertsGroup'
import { Offer, PartialOffer } from './Signal/Offer'
import { Answer, PartialAnswer } from './Signal/Answer'
import { Flush, PartialFlush } from './Signal/Flush'
import { FriendshipsGroupStruct } from './FriendshipsGroup'
import { FriendshipsGroupSummary } from './FriendshipsGroupSummary'
import { DESTROY_REASON } from './Friendship'
import { Missive } from './Missive'
import { OfferInfo } from './OfferInfo'
import { PartySummary } from './PartySummary'

export interface PeerClientIdAndDistance {
  peerClientId: Bytes32;
  distance: Uint256;
}

export interface PartyStruct extends FriendshipsGroupStruct, ExtrovertsGroupStruct {
  clientId: Bytes32;
  bootstrapOffersTimeout: number;
  maxFriendshipsCount: number;
  maxOfferAttemptsCount: number;
  maxOfferLastReceivedAgo: number;
}

export class Party {

  private offerInfos: Array<OfferInfo> = [];
  private isClientIdBanned: Record<string, boolean> = {};

  private introvertsGroup: IntrovertsGroup;
  private extrovertsGroup: ExtrovertsGroup;

  private introvertsGroupSummary: FriendshipsGroupSummary = new FriendshipsGroupSummary(
    [],
  );
  private extrovertsGroupSummary: FriendshipsGroupSummary = new FriendshipsGroupSummary(
    [],
  );

  private isBootstrapOffersComplete: boolean = false;

  readonly summarySnowdrop: Snowdrop<PartySummary> = new Snowdrop<PartySummary>();
  readonly partialAnswerSnowdrop: Snowdrop<PartialAnswer> = new Snowdrop<PartialAnswer>();
  readonly partialOfferSnowdrop: Snowdrop<PartialOffer> = new Snowdrop<PartialOffer>();
  readonly partialFlushSnowdrop: Snowdrop<PartialFlush> = new Snowdrop<PartialFlush>();
  readonly missiveSnowdrop: Snowdrop<Missive> = new Snowdrop<Missive>();

  constructor(private struct: PartyStruct) {
    this.introvertsGroup = new IntrovertsGroup({ ...struct })
    this.extrovertsGroup = new ExtrovertsGroup({ ...struct })

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

    this.introvertsGroup.missiveSnowdrop.addHandle((snowdrop) => {
      this.missiveSnowdrop.emit(snowdrop)
    })

    this.extrovertsGroup.missiveSnowdrop.addHandle((snowdrop) => {
      this.missiveSnowdrop.emit(snowdrop)
    })

    delay(struct.bootstrapOffersTimeout * 1000).then(() => {
      this.isBootstrapOffersComplete = true
      for (let i = this.getFriendshipsCount(); i < struct.maxFriendshipsCount; i++) {
        this.maybeCreateFriendship()
      }
    })

    setInterval(() => {
      this.clearOldOffers()
    }, 1000)
  }

  private clearOldOffers(): void {
    this.offerInfos = this.offerInfos.filter((offerInfo) => {
      const lastReceivedAgo = offerInfo.getLastReceivedAgo()
      if (lastReceivedAgo <= this.struct.maxOfferLastReceivedAgo) {
        return true
      }
      return false
    })
  }

  private getBestConnectableOfferInfo(): OfferInfo | null {
    const peerClientIds = this.getPeerClientIds()

    const connectableOfferInfos = this.offerInfos.filter((offerInfo): boolean => {
      if (offerInfo.getAttemptsCount() >= this.struct.maxOfferAttemptsCount) {
        return false
      }
      for (let i = 0; i < peerClientIds.length; i++) {
        if (peerClientIds[i].uu.getIsEqual(offerInfo.offer.clientId.uu)) {
          return false
        }
      }
      return true
    })

    const sortedConnectableOfferInfos = connectableOfferInfos.sort(
      (offerInfoA, offerInfoB): number => {
        if (!offerInfoA.offer.clientId.uu.getIsEqual(offerInfoB.offer.clientId)) {
          if (offerInfoA.getDistance() < offerInfoB.getDistance()) {
            return -1
          }
          return 1
        }

        if (offerInfoA.getLastReceivedAgo() < offerInfoB.getLastReceivedAgo()) {
          return -1
        }
        if (offerInfoA.getLastReceivedAgo() > offerInfoB.getLastReceivedAgo()) {
          return 1
        }
        if (offerInfoA.getAttemptsCount() < offerInfoB.getAttemptsCount()) {
          return -1
        }
        if (offerInfoA.getAttemptsCount() > offerInfoB.getAttemptsCount()) {
          return 1
        }
        return 0
      },
    )

    if (sortedConnectableOfferInfos.length === 0) {
      return null
    }
    return sortedConnectableOfferInfos[0]
  }

  private maybeCreateFriendship(): void {
    if (this.getFriendshipsCount() >= this.struct.maxFriendshipsCount) {
      this.maybeDestroyFriendship()
      return
    }
    const offerInfo = this.getBestConnectableOfferInfo()
    if (offerInfo) {
      offerInfo.incrementAttemptsCount()
      this.introvertsGroup.create(offerInfo.offer)
    } else if (this.isBootstrapOffersComplete) {
      this.extrovertsGroup.create()
    }
  }

  private maybeDestroyFriendship(): void {
    const offerInfo = this.getBestConnectableOfferInfo()
    if (offerInfo === null) {
      return
    }
    if (this.extrovertsGroup.getHasAnUnconnectedFriendship()) {
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

  private getPeerClientIdsAndDistances(): Array<PeerClientIdAndDistance> {
    return this.getPeerClientIds()
      .map((peerClientId) => {
        return {
          peerClientId,
          distance: new Uint256(peerClientId.uu.genXor(this.struct.clientId.uu)),
        }
      })
  }

  private getWorstPeerClientIdAndDistance(): {
    peerClientId: Bytes32;
    distance: Uint256;
  } | null {
    const peerClientIdAndDistances = this.getPeerClientIdsAndDistances()
      .sort((peerClientIdAndDistanceA, peerClientIdAndDistanceB) => {
        const distanceA = peerClientIdAndDistanceA.distance
        const distanceB = peerClientIdAndDistanceB.distance
        if (distanceA.compGt(distanceB)) {
          return -1
        }
        if (distanceA.compLt(distanceB)) {
          return 1
        }
        return 0
      })
    return peerClientIdAndDistances[0]
  }

  private destroyFriendshipWithPeerClientId(
    peerClientId: Bytes32,
    destroyReason: DESTROY_REASON,
  ): void {
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
      peerClientIdAndDistances: this.getPeerClientIdsAndDistances(),
      introvertsGroupSummary: this.introvertsGroup.getSummary(),
      extrovertsGroupSummary: this.extrovertsGroup.getSummary(),
      offerInfos: this.offerInfos,
    })
  }

  private getFriendshipsCount(): number {
    return (
      this.introvertsGroup.getFriendshipsCount()
      + this.extrovertsGroup.getFriendshipsCount()
    )
  }

  handleOffer(offer: Offer): void {
    if (this.isClientIdBanned[offer.clientId.uu.toHex()]) {
      return
    }
    const offerInfo = this.offerInfos.find((_offerInfo) => {
      return _offerInfo.offer.id.uu.getIsEqual(offer.id.uu)
    })
    if (offerInfo === undefined) {
      this.offerInfos.push(new OfferInfo({ offer, clientId: this.struct.clientId }))
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
      }
      return true
    })
  }

  getPeerClientIds(): Array<Bytes32> {
    return [
      ...this.introvertsGroup.getPeerClientIds(),
      ...this.extrovertsGroup.getPeerClientIds(),
    ]
  }

  broadcastMissive(missive: Missive): void {
    this.introvertsGroup.broadcastMissive(missive)
    this.extrovertsGroup.broadcastMissive(missive)
  }

  private banClientId(clientId: Bytes32): void {
    this.isClientIdBanned[clientId.uu.toHex()] = true
    this.offerInfos = this.offerInfos.filter((offerInfo) => {
      return offerInfo.offer.clientId.uu.getIsEqual(clientId.uu)
    })
  }

}
