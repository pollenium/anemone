import { Friendship, FRIENDSHIP_STATUS } from './Friendship'
import { Extrovert } from './Extrovert'
import { Introvert } from './Introvert'
import { SignalingClient } from './SignalingClient'
import { Uish, Uu } from 'pollenium-uvaursi'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { FlushOffer } from './FlushOffer'
import { ClientOptions } from '../interfaces/ClientOptions'
import delay from 'delay'
import { ClientDefaultOptions } from './ClientDefaultOptions'
import { Snowdrop } from 'pollenium-snowdrop'
import { Missive } from './Missive'

export class Client {

  options: ClientOptions;

  nonce: Uu;

  signalingClients: SignalingClient[] = [];

  extroverts: Extrovert[] = [];

  introverts: Introvert[] = [];

  offers: Offer[] = [];

  answer: Answer[] = [];

  signalingClientsByOfferIdHex: { [id: string]: SignalingClient } = {};

  friendshipStatusByClientNonceHex: { [id: string]: FRIENDSHIP_STATUS } = {};

  offersReceivedByClientNonceHex: { [id: string]: number } = {};

  isFlushedOfferByOfferIdHex: { [id: string]: boolean } = {}

  missiveIsReceivedByIdHexByEra: { [era: number]: { [missiveIdHex: string]: boolean }} = {};

  readonly friendshipStatusSnowdrop: Snowdrop<Friendship> = new Snowdrop<Friendship>();

  readonly extrovertSnowdrop: Snowdrop<Extrovert> = new Snowdrop<Extrovert>();

  readonly introvertSnowdrop: Snowdrop<Introvert> = new Snowdrop<Introvert>();

  readonly missiveSnowdrop: Snowdrop<Missive> = new Snowdrop<Missive>();


  constructor(options: ClientOptions) {
    this.options = Object.assign(new ClientDefaultOptions, options)
    this.nonce = Uu.genRandom(32)
    this.bootstrap()
  }

  private async bootstrap(): Promise<void> {
    for (let i = 0; i < this.options.signalingServerUrls.length; i++) {
      const signalingServerUrl = this.options.signalingServerUrls[i]
      this.addSignalingClient(signalingServerUrl)
    }

    await this.loopCreateFriendship()
  }

  private async loopCreateFriendship(): Promise<void> {
    if (this.extroverts.length + this.introverts.length >= this.options.friendshipsMax) {
      return
    }
    await this.createFriendship()
    this.loopCreateFriendship()
  }

  getFriendshipsCount(): number {
    return this.introverts.length + this.extroverts.length
  }

  async createFriendship(): Promise<void> {

    if (this.getFriendshipsCount() === this.options.friendshipsMax) {
      return
    }

    const offer = this.popConnectableOffer()
    if (offer !== null) {
      this.introverts.push(new Introvert(this, offer))
    }

    await delay(this.options.bootstrapOffersTimeout * 1000)

    if (this.getFriendshipsCount() === this.options.friendshipsMax) {
      return
    }

    const offer2 = this.popConnectableOffer()
    if (offer2 === null) {
      const extrovert = new Extrovert(this)
      this.extroverts.push(extrovert)
      this.extrovertSnowdrop.emitIfHandle(extrovert)
    } else {
      const introvert = new Introvert(this, offer2)
      this.introverts.push(introvert)
      this.introvertSnowdrop.emitIfHandle(introvert)
    }

  }

  addSignalingClient(signalingServerUrl: string): void {
    const signalingClient = new SignalingClient(this, signalingServerUrl)
    this.signalingClients.push(signalingClient)

    signalingClient.offerSnowdrop.addHandle((offer) => {
      this.handleOffer(signalingClient, offer)
    })

    signalingClient.answerSnowdrop.addHandle((answer) => {
      this.handleAnswer(signalingClient, answer)
    })

    signalingClient.flushOfferSnowdrop.addHandle((flushOffer) => {
      this.handleFlushOffer(signalingClient, flushOffer)
    })

  }

  popConnectableOffer(): null | Offer {
    const connectableOfferIndex = this.offers.findIndex((offer) => {
      return this.getIsConnectableByClientNonce(offer.clientNonce)
    })
    if (connectableOfferIndex === -1) {
      return null
    }

    const offer = this.offers.splice(connectableOfferIndex, 1)[0]

    if (this.isFlushedOfferByOfferIdHex[offer.getId().toHex()]) {
      return this.popConnectableOffer()
    }

    return offer

  }

  async fetchExtrovertsByOfferIdHex(): Promise<{[id: string]: Extrovert}> {
    const extrovertsByOfferIdHex: {[id: string]: Extrovert} = {}
    await Promise.all(this.extroverts.map(async (extrovert) => {
      const offer = await extrovert.fetchOffer()
      extrovertsByOfferIdHex[offer.getId().toHex()] = extrovert
    }))
    return extrovertsByOfferIdHex
  }

  handleOffer(signalingClient: SignalingClient, offer: Offer): void {

    if (this.isFlushedOfferByOfferIdHex[offer.getId().toHex()]) {
      return
    }

    if (
      this.offersReceivedByClientNonceHex[offer.clientNonce.toHex()] === undefined
    ) {
      this.offersReceivedByClientNonceHex[offer.clientNonce.toHex()] = 1
    } else {
      this.offersReceivedByClientNonceHex[offer.clientNonce.toHex()] += 1
    }

    if (this.nonce.getIsEqual(offer.clientNonce)) {
      return
    }

    const offerIdHex = offer.getId().toHex()


    this.signalingClientsByOfferIdHex[offerIdHex] = signalingClient

    this.offers = this.offers.filter((_offer) => {
      return !offer.clientNonce.getIsEqual(_offer.clientNonce)
    })

    this.offers.unshift(offer)

    this.offers = this.offers.sort((offerA, offerB) => {
      const distanceA = offerA.getDistance(this.nonce)
      const distanceB = offerB.getDistance(this.nonce)
      return distanceB.compGt(distanceA) ? 1 : -1
    })

    if (this.getIsConnectableByClientNonce(offer.clientNonce)) {
      const peeredFriendships = this.getPeeredFriendships()
      if (peeredFriendships.length === this.options.friendshipsMax) {
        const offerDistance = offer.getDistance(this.nonce)
        const worstFriendship = this.getWorstFriendship()
        const worstFriendshipDistance = worstFriendship.getDistance()
        if (worstFriendshipDistance.compGt(offerDistance)) {
          worstFriendship.destroy()
        }
      }
    }
    this.createFriendship()
  }

  private getPeeredFriendships(): Friendship[] {
    return this.getFriendships().filter((friendship) => {
      return friendship.peerClientNonce !== undefined
    })
  }

  private getWorstFriendship(): null | Friendship {
    const peeredFriendships = this.getPeeredFriendships()
    if (peeredFriendships.length === 0) {
      return null
    }

    return peeredFriendships.sort((friendshipA, friendshipB) => {
      const distanceA = friendshipA.getDistance()
      const distanceB = friendshipB.getDistance()
      return distanceA.compGt(distanceB) ? 1 : -1
    })[0]
  }

  handleFlushOffer(signalingClient: SignalingClient, flushOffer: FlushOffer): void {

    this.isFlushedOfferByOfferIdHex[flushOffer.offerId.toHex()] = true

    this.offers = this.offers.filter((_offer) => {
      return !flushOffer.offerId.getIsEqual(_offer.getId())
    })

    this.introverts.forEach((introvert) => {
      if (introvert.offer.getId().getIsEqual(flushOffer.offerId)) {
        introvert.destroy()
      }
    })
  }

  getFriendships(): Friendship[] {
    const friendships: Friendship[] = []
    friendships.push(...this.extroverts)
    friendships.push(...this.introverts)
    return friendships
  }

  async handleAnswer(signalingClient: SignalingClient, answer: Answer): Promise<void> {

    const extrovertsByOfferIdHex = await this.fetchExtrovertsByOfferIdHex()
    const extrovert = extrovertsByOfferIdHex[answer.offerId.toHex()]

    if (!extrovert) {
      return
    }

    if (!this.getIsConnectableByClientNonce(answer.clientNonce)) {
      return
    }

    if (extrovert.status === FRIENDSHIP_STATUS.DEFAULT) {
      extrovert.handleAnswer(answer)
    }
  }

  getFriendshipStatusByClientNonce(clientNonceUish: Uish): FRIENDSHIP_STATUS {
    const clientNonce = Uu.wrap(clientNonceUish)
    const friendshipStatus = this.friendshipStatusByClientNonceHex[clientNonce.toHex()]
    if (friendshipStatus === undefined) {
      return FRIENDSHIP_STATUS.DEFAULT
    }
      return friendshipStatus

  }

  getIsConnectableByClientNonce(clientNonceUish: Uish): boolean {
    const clientNonce = Uu.wrap(clientNonceUish)
    if (clientNonce.getIsEqual(this.nonce)) {
      return false
    }
    switch(this.getFriendshipStatusByClientNonce(clientNonce)) {
      case FRIENDSHIP_STATUS.DEFAULT:
      case FRIENDSHIP_STATUS.DESTROYED:
        return true;
      case FRIENDSHIP_STATUS.CONNECTING:
      case FRIENDSHIP_STATUS.CONNECTED:
        return false;
      default:
        throw new Error('Unkown FRIENDSHIP_STATUS')
    }
  }

  setFriendshipStatusByClientNonce(clientNonceUish: Uish, friendshipStatus: FRIENDSHIP_STATUS): void {
    const clientNonce = Uu.wrap(clientNonceUish)
    this.friendshipStatusByClientNonceHex[clientNonce.toHex()] = friendshipStatus
  }

  getIsFullyConnected(): boolean {
    if (this.extroverts.length + this.introverts.length < this.options.friendshipsMax) {
      return false
    }
    for (let i = 0; i < this.extroverts.length; i++) {
      if (this.extroverts[i].status !== FRIENDSHIP_STATUS.CONNECTED) {
        return false
      }
    }
    for (let i = 0; i < this.introverts.length; i++) {
      if (this.introverts[i].status !== FRIENDSHIP_STATUS.CONNECTED) {
        return false
      }
    }
    return true
  }

}
