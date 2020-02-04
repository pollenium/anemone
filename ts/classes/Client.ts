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
import { MissivesDb } from './MissivesDb'
import { Missive } from './Missive'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'
import { ClientSummary } from './ClientSummary'

export interface ClientStruct
  extends Omit<PartyStruct, 'clientId'>,
    SignalingClientsManagerStruct {}

export class Client {

  readonly id: Bytes32 = new Bytes32(Uu.genRandom(32));

  readonly friendshipStatusSnowdrop: Snowdrop<Friendship> = new Snowdrop<Friendship>();
  readonly extrovertSnowdrop: Snowdrop<Extrovert> = new Snowdrop<Extrovert>();
  readonly introvertSnowdrop: Snowdrop<Introvert> = new Snowdrop<Introvert>();
  readonly missiveSnowdrop: Snowdrop<Missive> = new Snowdrop<Missive>();
  readonly summarySnowdrop: Snowdrop<ClientSummary> = new Snowdrop<ClientSummary>();

  private missivesDb: MissivesDb = new MissivesDb();
  private party: Party;
  private signalingClientsManager: SignalingClientsManager;

  private maxFriendshipsConnectedPrimrose: Primrose<void> = new Primrose<void>();

  constructor(private struct: ClientStruct) {
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
        clientId: this.id,
        ...partialFlush,
      })
      this.signalingClientsManager.handleFlush(flush)
    })

    this.party.summarySnowdrop.addHandle(() => {
      this.summarySnowdrop.emitIfHandle(this.getSummary())
    })
  }

  getSummary(): ClientSummary {
    return new ClientSummary({
      id: this.id,
      partySummary: this.party.getSummary(),
    })
  }

  broadcastMissive(missive: Missive): void {
    this.party.broadcastMissive(missive)
  }

}
