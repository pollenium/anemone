import { Friend, FRIEND_STATUS } from './Friend'
import { Offer } from './Offer'
import { Answer } from './Answer'
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer'
import { getNow, getSimplePeerConfig } from '../utils'
import delay from 'delay'
import { Bytes } from './Bytes'
import * as wrtc from 'wrtc'
import { Client } from './Client'

export class Extrovert extends Friend {

  answers: Answer[] = [];

  offerSdpPromise: Promise<string>;

  offersSentAt: number;

  constructor(client: Client) {
    super(client, new SimplePeer({
      initiator: true,
      wrtc,
      config: getSimplePeerConfig()
    }))
    this.loopUploadOffer(1000)
  }

  private async loopUploadOffer(timeout: number): Promise<void> {
    await this.uploadOffer()
    await delay(timeout)
    if (this.status === FRIEND_STATUS.DEFAULT) {
      this.loopUploadOffer(timeout)
    }
  }

  private async uploadOffer(): Promise<void> {
    this.offersSentAt = getNow()
    const offer = await this.fetchOffer()
    this.client.signalingClients.forEach((signalingClient) => {
      signalingClient.sendOffer(offer)
    })
  }

  private async fetchOfferSdp(): Promise<string> {
    if (this.offerSdpPromise) {
      return this.offerSdpPromise
    }
    this.offerSdpPromise = new Promise((resolve): void => {
      this.simplePeer.once('signal', (offer: SimplePeerSignalData) => {
        resolve(offer.sdp)

        setTimeout(() => {
          if (this.status === FRIEND_STATUS.DEFAULT) {
            this.destroy()
          }
        }, 10 * 1000)

      })
    })
    return this.offerSdpPromise
  }

  private async fetchOfferSdpb(): Promise<Bytes> {
    const offerSdp = await this.fetchOfferSdp()
    return Bytes.fromUtf8(offerSdp)
  }

  async fetchOffer(): Promise<Offer> {
    return new Offer(
      this.client.nonce,
      await this.fetchOfferSdpb()
    )
  }

  async fetchOfferId(): Promise<Bytes> {
    const offer = await this.fetchOffer()
    return offer.getId()
  }

  async handleAnswer(answer: Answer): Promise<void> {
    if (this.status !== FRIEND_STATUS.DEFAULT) {
      throw new Error('Must be in FRIEND_STATUS.DEFAULT')
    }

    if (!this.client.getIsConnectableByClientNonce(answer.clientNonce)) {
      return
    }

    this.peerClientNonce = answer.clientNonce
    this.setStatus(FRIEND_STATUS.CONNECTING)
    this.simplePeer.signal({
      type: 'answer',
      sdp: answer.sdpb.getUtf8()
    })

    await delay(this.client.signalTimeoutMs)

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (this.status === FRIEND_STATUS.CONNECTING) {
      this.destroy()
    }
  }

  async fetchStatusPojo(): Promise<any> {
    const offer = await this.fetchOffer()
    return Object.assign(super.getStatusPojo(), {
      offerSentAgo: (getNow() - this.offersSentAt),
      offerIdHex: offer.getId().getHex()
    })
  }

  destroy(): void {
    const friendIndex = this.client.extroverts.indexOf(this)
    this.client.extroverts.splice(friendIndex, 1)
    super.destroy()
  }

}
