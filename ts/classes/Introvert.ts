import { Friendship, FRIENDSHIP_STATUS } from './Friendship'
import { Offer } from './Offer'
import { Answer } from './Answer'
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer'
import { genSimplePeerConfig } from '../utils'
import delay from 'delay'
import { Uu } from 'pollenium-uvaursi'
import { Client } from './Client'


export class Introvert extends Friendship {

  constructor(client: Client, public offer: Offer) {
    super(client, new SimplePeer({
      initiator: false,
      trickle: false,
      wrtc: client.options.wrtc,
      config: genSimplePeerConfig()
    }))
    this.peerClientNonce = offer.clientNonce
    this.connect()
  }

  private fetchAnswerSdpb(): Promise<Uu> {
    return new Promise((resolve): void => {
      this.simplePeer.once('signal', (signal: SimplePeerSignalData) => {
        resolve(Uu.fromUtf8(signal.sdp))
      })
      this.simplePeer.signal({
        type: 'offer',
        sdp: this.offer.sdpb.toUtf8()
      })
    })
  }

  private async fetchAnswer(): Promise<Answer> {
    return new Answer({
      clientNonce: this.client.nonce,
      offerId: this.offer.getId(),
      sdpb: await this.fetchAnswerSdpb()
    })
  }

  private async connect(): Promise<void> {

    this.setStatus(FRIENDSHIP_STATUS.CONNECTING)

    const answer = await this.fetchAnswer()

    this.client.signalingClientsByOfferIdHex[this.offer.getId().toHex()].sendAnswer(answer)

    await delay(this.client.options.signalTimeout * 1000)

    if (this.status === FRIENDSHIP_STATUS.CONNECTING) {
      this.destroy()
    }
  }

  destroy(): void {
    const friendshipIndex = this.client.introverts.indexOf(this)
    this.client.introverts.splice(friendshipIndex, 1)
    super.destroy()
  }

}
