import { Friend, FRIEND_STATUS } from './Friend'
import { Extrovert } from './Extrovert'
import { Introvert } from './Introvert'
import { SignalingClient } from './SignalingClient'
import EventEmitter from 'events'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { FlushOffer } from './FlushOffer'
import { ClientOptions } from '../interfaces/ClientOptions'
import delay from 'delay'
import Bn from 'bn.js'
import { ClientDefaultOptions } from './ClientDefaultOptions'

export class Client extends EventEmitter {

  options: ClientOptions;

  nonce: Bytes;

  signalingClients: SignalingClient[] = [];

  extroverts: Extrovert[] = [];

  introverts: Introvert[] = [];

  offers: Offer[] = [];

  answer: Answer[] = [];

  signalingClientsByOfferIdHex: { [id: string]: SignalingClient } = {};

  friendStatusByClientNonceHex: { [id: string]: FRIEND_STATUS } = {};

  offersReceivedByClientNonceHex: { [id: string]: number } = {};

  isFlushedOfferByOfferIdHex: { [id: string]: boolean } = {}

  missiveIsReceivedByIdHexByEra: { [era: number]: { [missiveIdHex: string]: boolean }} = {};

  signalTimeoutMs: number;

  missiveLatencyToleranceBn: Bn;


  constructor(options: ClientOptions) {
    super()
    this.options = Object.assign(new ClientDefaultOptions, options)
    this.signalTimeoutMs = this.options.signalTimeout * 1000
    this.missiveLatencyToleranceBn = new Bn(this.options.missiveLatencyTolerance)
    this.nonce = Bytes.random(32)
    this.bootstrap()
  }

  private async bootstrap(): Promise<void> {
    for (let i = 0; i < this.options.signalingServerUrls.length; i++) {
      const signalingServerUrl = this.options.signalingServerUrls[i]
      this.addSignalingClient(signalingServerUrl)
    }

    await this.loopCreateFriend()
  }

  private async loopCreateFriend(): Promise<void> {
    if (this.extroverts.length + this.introverts.length >= this.options.friendsMax) {
      return
    }
    await this.createFriend()
    this.loopCreateFriend()
  }

  getFriendsCount(): number {
    return this.introverts.length + this.extroverts.length
  }

  async createFriend(): Promise<void> {

    if (this.getFriendsCount() === this.options.friendsMax) {
      return
    }

    const offer = this.popConnectableOffer()
    if (offer !== null) {
      this.introverts.push(new Introvert(this, offer))
    }

    await delay(this.options.bootstrapOffersTimeout * 1000)

    if (this.getFriendsCount() === this.options.friendsMax) {
      return
    }

    const offer2 = this.popConnectableOffer()
    if (offer2 === null) {
      const extrovert = new Extrovert(this)
      this.extroverts.push(extrovert)
      this.emit('extrovert', extrovert)
      this.emit('friend', extrovert)
    } else {
      const introvert = new Introvert(this, offer2)
      this.introverts.push(introvert)
      this.emit('introvert', introvert)
      this.emit('friend', introvert)
    }

  }

  addSignalingClient(signalingServerUrl: string): void {
    const signalingClient = new SignalingClient(this, signalingServerUrl)
    this.signalingClients.push(signalingClient)

    signalingClient.on('offer', (offer) => {
      this.handleOffer(signalingClient, offer)
    })

    signalingClient.on('answer', (answer) => {
      this.handleAnswer(signalingClient, answer)
    })

    signalingClient.on('flushOffer', (flushOffer) => {
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

    if (this.isFlushedOfferByOfferIdHex[offer.getId().getHex()]) {
      return this.popConnectableOffer()
    }

    return offer

  }

  async fetchExtrovertsByOfferIdHex(): Promise<{[id: string]: Extrovert}> {
    const extrovertsByOfferIdHex: {[id: string]: Extrovert} = {}
    await Promise.all(this.extroverts.map(async (extrovert) => {
      const offer = await extrovert.fetchOffer()
      extrovertsByOfferIdHex[offer.getId().getHex()] = extrovert
    }))
    return extrovertsByOfferIdHex
  }

  handleOffer(signalingClient: SignalingClient, offer: Offer): void {

    if (this.isFlushedOfferByOfferIdHex[offer.getId().getHex()]) {
      return
    }

    if (
      this.offersReceivedByClientNonceHex[offer.clientNonce.getHex()] === undefined
    ) {
      this.offersReceivedByClientNonceHex[offer.clientNonce.getHex()] = 1
    } else {
      this.offersReceivedByClientNonceHex[offer.clientNonce.getHex()] += 1
    }

    if (this.nonce.equals(offer.clientNonce)) {
      return
    }

    const offerIdHex = offer.getId().getHex()


    this.signalingClientsByOfferIdHex[offerIdHex] = signalingClient

    this.offers = this.offers.filter((_offer) => {
      return !offer.clientNonce.equals(_offer.clientNonce)
    })

    this.offers.unshift(offer)

    this.offers = this.offers.sort((offerA, offerB) => {
      const distanceA = offerA.getDistance(this.nonce)
      const distanceB = offerB.getDistance(this.nonce)
      return distanceB.compare(distanceA)
    })

    if (this.getIsConnectableByClientNonce(offer.clientNonce)) {
      const peeredFriends = this.getPeeredFriends()
      if (peeredFriends.length === this.options.friendsMax) {
        const offerDistance = offer.getDistance(this.nonce)
        const worstFriend = this.getWorstFriend()
        const worstFriendDistance = worstFriend.getDistance()
        if (worstFriendDistance.compare(offerDistance) === 1) {
          worstFriend.destroy()
        }
      }
    }
    this.createFriend()
  }

  private getPeeredFriends(): Friend[] {
    return this.getFriends().filter((friend) => {
      return friend.peerClientNonce !== undefined
    })
  }

  private getWorstFriend(): null | Friend {
    const peeredFriends = this.getPeeredFriends()
    if (peeredFriends.length === 0) {
      return null
    }

    return peeredFriends.sort((friendA, friendB) => {
      const distanceA = friendA.getDistance()
      const distanceB = friendB.getDistance()
      return distanceA.compare(distanceB)
    })[0]
  }

  handleFlushOffer(signalingClient: SignalingClient, flushOffer: FlushOffer): void {

    this.isFlushedOfferByOfferIdHex[flushOffer.offerId.getHex()] = true

    this.offers = this.offers.filter((_offer) => {
      return !flushOffer.offerId.equals(_offer.getId())
    })

    this.introverts.forEach((introvert) => {
      if (introvert.offer.getId().equals(flushOffer.offerId)) {
        introvert.destroy()
      }
    })
  }

  getFriends(): Friend[] {
    const friends: Friend[] = []
    friends.push(...this.extroverts)
    friends.push(...this.introverts)
    return friends
  }

  async handleAnswer(signalingClient: SignalingClient, answer: Answer): Promise<void> {

    const extrovertsByOfferIdHex = await this.fetchExtrovertsByOfferIdHex()
    const extrovert = extrovertsByOfferIdHex[answer.offerId.getHex()]

    if (!extrovert) {
      return
    }

    if (!this.getIsConnectableByClientNonce(answer.clientNonce)) {
      return
    }

    if (extrovert.status === FRIEND_STATUS.DEFAULT) {
      extrovert.handleAnswer(answer)
    }
  }

  getFriendStatusByClientNonce(clientNonce: Bytes): FRIEND_STATUS {
    const friendStatus = this.friendStatusByClientNonceHex[clientNonce.getHex()]
    if (friendStatus === undefined) {
      return FRIEND_STATUS.DEFAULT
    }
      return friendStatus

  }

  getIsConnectableByClientNonce(clientNonce: Bytes): boolean {
    if (clientNonce.equals(this.nonce)) {
      return false
    }
    switch(this.getFriendStatusByClientNonce(clientNonce)) {
      case FRIEND_STATUS.DEFAULT:
      case FRIEND_STATUS.DESTROYED:
        return true;
      case FRIEND_STATUS.CONNECTING:
      case FRIEND_STATUS.CONNECTED:
        return false;
      default:
        throw new Error('Unkown FRIEND_STATUS')
    }
  }

  setFriendStatusByClientNonce(clientNonce: Bytes, friendStatus: FRIEND_STATUS): void {
    this.friendStatusByClientNonceHex[clientNonce.getHex()] = friendStatus
  }

  getIsFullyConnected(): boolean {
    if (this.extroverts.length + this.introverts.length < this.options.friendsMax) {
      return false
    }
    for (let i = 0; i < this.extroverts.length; i++) {
      if (this.extroverts[i].status !== FRIEND_STATUS.CONNECTED) {
        return false
      }
    }
    for (let i = 0; i < this.introverts.length; i++) {
      if (this.introverts[i].status !== FRIEND_STATUS.CONNECTED) {
        return false
      }
    }
    return true
  }

}
