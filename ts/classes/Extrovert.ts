import { Friendship, FRIENDSHIP_STATUS } from './Friendship'
import { Offer } from './Offer'
import { FlushOffer } from './FlushOffer'
import { Answer } from './Answer'
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer'
import { genNow, genSimplePeerConfig } from '../utils'
import delay from 'delay'
import { Uu } from 'pollenium-uvaursi'
import { Client } from './Client'

export class Extrovert extends Friendship {

  answers: Answer[] = [];

  offerSdpPromise: Promise<string>;

  offersSentAt: number;

  constructor(client: Client) {
    super(client, new SimplePeer({
      initiator: true,
      trickle: false,
      wrtc: client.options.wrtc,
      config: genSimplePeerConfig()
    }))
    this.loopUploadOffer(1000)
  }

  private async loopUploadOffer(timeout: number): Promise<void> {
    await this.uploadOffer()
    await delay(timeout)
    if (this.status === FRIENDSHIP_STATUS.DEFAULT) {
      this.loopUploadOffer(timeout)
    }
  }

  private async uploadOffer(): Promise<void> {
    this.offersSentAt = genNow()
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
      this.simplePeer.once('signal', (signal: SimplePeerSignalData) => {
        resolve(signal.sdp)

        setTimeout(() => {
          if (this.status === FRIENDSHIP_STATUS.DEFAULT) {
            this.destroy()
          }
        }, this.client.options.signalTimeout * 1000 * 2)

      })
    })
    return this.offerSdpPromise
  }

  private async fetchOfferSdpb(): Promise<Uu> {
    const offerSdp = await this.fetchOfferSdp()
    return Uu.fromUtf8(offerSdp)
  }

  async fetchOffer(): Promise<Offer> {
    return new Offer({
      clientNonce: this.client.nonce,
      sdpb: await this.fetchOfferSdpb()
    })
  }

  async fetchOfferId(): Promise<Uu> {
    const offer = await this.fetchOffer()
    return offer.getId()
  }

  async handleAnswer(answer: Answer): Promise<void> {

    if (this.status !== FRIENDSHIP_STATUS.DEFAULT) {
      throw new Error('Must be in FRIENDSHIP_STATUS.DEFAULT')
    }

    if (!this.client.getIsConnectableByClientNonce(answer.clientNonce)) {
      return
    }

    this.peerClientNonce = answer.clientNonce
    this.setStatus(FRIENDSHIP_STATUS.CONNECTING)
    this.simplePeer.signal({
      type: 'answer',
      sdp: answer.sdpb.toUtf8()
    })

    await delay(this.client.options.signalTimeout * 1000)

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (this.status === FRIENDSHIP_STATUS.CONNECTING) {
      this.destroy()
    }
  }

  async uploadFlushOffer(): Promise<void> {
    const offer = await this.fetchOffer()
    const flushOffer = new FlushOffer(offer.getId())
    this.client.signalingClients.forEach((signalingClient) => {
      signalingClient.sendFlushOffer(flushOffer)
    })
  }

  async destroy(): Promise<void> {
    await this.uploadFlushOffer()
    const friendshipIndex = this.client.extroverts.indexOf(this)
    this.client.extroverts.splice(friendshipIndex, 1)
    super.destroy()
  }

}
