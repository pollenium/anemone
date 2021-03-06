import { Uu } from 'pollenium-uvaursi'
import { Bytes32 } from 'pollenium-buttercup'
import { Snowdrop } from 'pollenium-snowdrop'
import { Primrose } from 'pollenium-primrose'
import { Friendship } from './Friendship'
import { Extrovert } from './Friendship/Extrovert'
import { Introvert } from './Friendship/Introvert'
import {
  SignalingClientsManager,
  SignalingClientsManagerStruct,
} from './SignalingClientsManager'
import { Party, PartyStruct } from './Party'
import { Missive } from './Missive'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'
import { ClientSummary } from './ClientSummary'

export interface ClientStruct
  extends Omit<PartyStruct, 'clientId'>,
    SignalingClientsManagerStruct {}

export const clientDefaults: Omit<ClientStruct, 'signalingServerUrls'> = {
  missiveLatencyTolerance: 30,
  sdpTimeout: 10,
  bootstrapOffersTimeout: 10,
  offerReuploadInterval: 5,
  maxFriendshipsCount: 6,
  maxOfferLastReceivedAgo: 30,
  maxOfferAttemptsCount: 5,
}

export class Client {

  readonly id: Bytes32 = new Bytes32(Uu.genRandom(32));

  readonly friendshipStatusSnowdrop: Snowdrop<Friendship> = new Snowdrop<Friendship>();
  readonly extrovertSnowdrop: Snowdrop<Extrovert> = new Snowdrop<Extrovert>();
  readonly introvertSnowdrop: Snowdrop<Introvert> = new Snowdrop<Introvert>();
  readonly missiveSnowdrop: Snowdrop<Missive> = new Snowdrop<Missive>();
  readonly summarySnowdrop: Snowdrop<ClientSummary> = new Snowdrop<ClientSummary>();

  private party: Party;
  private signalingClientsManager: SignalingClientsManager;

  private maxFriendshipsConnectedPrimrose: Primrose<void> = new Primrose<void>();
  private isMissiveReceivedByHashHex: Record<string, boolean> = {};
  private isMissiveBroadcastedByHashHex: Record<string, boolean> = {};

  constructor(struct: ClientStruct) {
    this.party = new Party({ clientId: this.id, ...struct })
    this.signalingClientsManager = new SignalingClientsManager({ ...struct })

    this.signalingClientsManager.offerSnowdrop.addHandle((offer) => {
      if (offer.clientId.uu.getIsEqual(this.id.uu)) {
        return
      }
      this.party.handleOffer(offer)
    })

    this.signalingClientsManager.answerSnowdrop.addHandle((answer) => {
      this.party.handleAnswer(answer)
    })

    this.signalingClientsManager.flushSnowdrop.addHandle((flush) => {
      this.party.handleFlush(flush)
    })

    this.party.partialOfferSnowdrop.addHandle((partialOffer) => {
      const offer = new Offer({
        clientId: this.id,
        ...partialOffer,
      })
      this.signalingClientsManager.handleOffer(offer)
    })

    this.party.partialAnswerSnowdrop.addHandle((partialAnswer) => {
      const answer = new Answer({
        clientId: this.id,
        ...partialAnswer,
      })
      this.signalingClientsManager.handleAnswer(answer)
    })

    this.party.partialFlushSnowdrop.addHandle((partialFlush) => {
      const flush = new Flush({
        ...partialFlush,
      })
      this.signalingClientsManager.handleFlush(flush)
    })

    this.party.summarySnowdrop.addHandle(() => {
      this.summarySnowdrop.emit(this.getSummary())
    })

    this.party.missiveSnowdrop.addHandle((missive) => {
      const missiveHashHex = missive.getHash().uu.toHex()
      if (this.isMissiveReceivedByHashHex[missiveHashHex]) {
        return
      }
      if (this.isMissiveBroadcastedByHashHex[missiveHashHex]) {
        return
      }
      this.isMissiveReceivedByHashHex[missiveHashHex] = true
      this.missiveSnowdrop.emit(missive)
      this.broadcastMissive(missive)
    })
  }

  getSummary(): ClientSummary {
    return new ClientSummary({
      id: this.id,
      partySummary: this.party.getSummary(),
    })
  }

  broadcastMissive(missive: Missive): void {
    const missiveHashHex = missive.getHash().uu.toHex()
    if (this.isMissiveBroadcastedByHashHex[missiveHashHex]) {
      throw new Error('Trying to broadcast a missive that has already been broadcast')
    }
    this.isMissiveBroadcastedByHashHex[missiveHashHex] = true
    this.party.broadcastMissive(missive)
  }

}
