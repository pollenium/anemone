import { Friend, FRIEND_STATUS } from './Friend'
import { Extrovert } from './Extrovert'
import { Introvert } from './Introvert'
import { SignalingClient } from './SignalingClient'
import EventEmitter from 'events'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { ClientOptions } from '../interfaces/ClientOptions'
import delay from 'delay'
import Bn from 'bn.js'
import { ClientDefaultOptions } from './ClientDefaultOptions'

export class Client extends EventEmitter {

  options: ClientOptions;

  nonce: Bytes;

  bootstrapPromise: Promise<void>;

  signalingClients: SignalingClient[] = [];

  extroverts: Extrovert[] = [];

  introverts: Introvert[] = [];

  offers: Offer[] = [];

  answer: Answer[] = [];

  signalingClientsByOfferIdHex: { [id: string]: SignalingClient } = {};

  friendStatusByClientNonceHex: { [id: string]: FRIEND_STATUS } = {};

  offersReceivedByClientNonceHex: { [id: string]: number } = {};

  friendMessageIsReceivedByIdHexByEra: { [era: number]: { [friendMessageIdHex: string]: boolean }} = {};

  signalTimeoutMs: number;

  friendMessageLatencyToleranceBn: Bn;


  constructor(options: ClientOptions) {
    super()
    this.options = Object.assign(new ClientDefaultOptions, options)
    this.signalTimeoutMs = this.options.signalTimeout * 1000
    this.friendMessageLatencyToleranceBn = new Bn(this.options.friendMessageLatencyTolerance)
    this.nonce = Bytes.random(32)
    this.bootstrap()
  }

  async bootstrap(): Promise<void> {
    for (let i = 0; i < this.options.signalingServerUrls.length; i++) {
      const signalingServerUrl = this.options.signalingServerUrls[i]
      this.addSignalingClient(signalingServerUrl)
    }
    await delay(1000)
    this.loopCreateFriend(5000)
  }

  async loopCreateFriend(timeout: number): Promise<void> {
    this.createFriend()
    await delay(timeout)
    this.loopCreateFriend(timeout)
  }

  createFriend(): void {
    if (this.extroverts.length + this.introverts.length >= this.options.friendsMax) {
      return
    }
    const offer = this.popConnectableOffer()
    if (offer === null) {
      this.extroverts.push(new Extrovert(this))
    } else {
      this.introverts.push(new Introvert(this, offer))
    }
  }

  addSignalingClient(signalingServerUrl: string): void {
    const signalingClient = new SignalingClient(signalingServerUrl)
    this.signalingClients.push(signalingClient)

    signalingClient.on('offer', (offer) => {
      this.handleOffer(signalingClient, offer)
    })

    signalingClient.on('answer', (answer) => {
      this.handleAnswer(signalingClient, answer)
    })
  }

  popConnectableOffer(): null | Offer {
    const connectableOfferIndex = this.offers.findIndex((offer) => {
      return this.getIsConnectableByClientNonce(offer.clientNonce)
    })
    if (connectableOfferIndex === -1) {
      return null
    }
      return this.offers.splice(connectableOfferIndex, 1)[0]

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

  async fetchStatusPojo(): Promise<any> {
    const offersCountByClientNonceHex = {}
    const offerIdHexByClientNonceHex = {}
    const isConnectableByClientNonceHex = {}

    this.offers.forEach((offer) => {
      // if(!this.getIsConnectableByClientNonce(offer.clientNonce)) {
      //   return
      // }
      const clientNonceHex = offer.clientNonce.getHex()
      if (offersCountByClientNonceHex[clientNonceHex] === undefined) {
        offersCountByClientNonceHex[clientNonceHex] = 1
        offerIdHexByClientNonceHex[clientNonceHex] = offer.getId().getHex()
        isConnectableByClientNonceHex[clientNonceHex] = this.getIsConnectableByClientNonce(offer.clientNonce)
      } else {
        offersCountByClientNonceHex[clientNonceHex] += 1
      }
    })

    Object.keys(this.offersReceivedByClientNonceHex).forEach((clientNonceHex) => {
      isConnectableByClientNonceHex[clientNonceHex] = this.getIsConnectableByClientNonce(Bytes.fromHex(clientNonceHex))
    })

    return {
      nonceHex: this.nonce.getHex(),
      friendStatusByClientNonceHex: this.friendStatusByClientNonceHex,
      offersCount: this.offers.length,
      offersCountByClientNonceHex,
      offerIdHexByClientNonceHex,
      isConnectableByClientNonceHex,
      offersReceivedByClientNonceHex: this.offersReceivedByClientNonceHex,
      extroverts: await Promise.all(this.extroverts.map((extrovert) => {
        return extrovert.fetchStatusPojo()
      })),
      introverts: this.introverts.map((introvert) => {
        return introvert.getStatusPojo()
      })
    }
  }

}
