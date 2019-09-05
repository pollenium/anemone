import { Friend, FRIEND_STATUS } from './Friend'
import { Offer } from './Offer'
import { Answer } from './Answer'
import * as SimplePeer from 'simple-peer'
import { getNow, getSimplePeerConfig } from '../utils'
import * as delay from 'delay'
import { Bytes } from './Bytes'
import * as wrtc from 'wrtc'
import { Client } from './Client'


export class Introvert extends Friend {

  constructor(client: Client, public offer: Offer) {
    super(client, new SimplePeer({
      initiator: false,
      wrtc,
      config: getSimplePeerConfig()
    }))
    this.peerClientNonce = offer.clientNonce
    this.connect()
  }

  private fetchAnswerSdpb(): Promise<Bytes> {
    return new Promise((resolve) => {
      this.simplePeer.once('signal', (signal) => {
        resolve(Bytes.fromUtf8(signal.sdp))
      })
      this.simplePeer.signal({
        type: 'offer',
        sdp: this.offer.sdpb.getUtf8()
      })
    })
  }

  private async fetchAnswer() {
    return new Answer(
      this.client.nonce,
      this.offer.getId(),
      await this.fetchAnswerSdpb()
    )
  }

  private async connect() {

    const answer = await this.fetchAnswer()

    this.setStatus(FRIEND_STATUS.CONNECTING)

    this.client.signalingClientsByOfferIdHex[this.offer.getId().getHex()].sendAnswer(answer)

    delay(this.client.signalTimeoutMs * 2).then(() => {
      if (this.status === FRIEND_STATUS.CONNECTING) {
        this.destroy()
      }
    })
  }

  destroy() {
    const friendIndex = this.client.introverts.indexOf(this)
    this.client.introverts.splice(friendIndex, 1)
    super.destroy()
  }

}
