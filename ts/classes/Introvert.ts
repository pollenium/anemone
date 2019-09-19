import { Friend, FRIEND_STATUS } from './Friend'
import { Offer } from './Offer'
import { Answer } from './Answer'
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer'
import { getSimplePeerConfig } from '../utils'
import delay from 'delay'
import { Bytes } from './Bytes'
import { Client } from './Client'


export class Introvert extends Friend {

  constructor(client: Client, public offer: Offer) {
    super(client, new SimplePeer({
      initiator: false,
      trickle: false,
      wrtc: client.options.wrtc,
      config: getSimplePeerConfig()
    }))
    this.peerClientNonce = offer.clientNonce
    this.connect()
  }

  private fetchAnswerSdpb(): Promise<Bytes> {
    return new Promise((resolve): void => {
      this.simplePeer.once('signal', (signal: SimplePeerSignalData) => {
        resolve(Bytes.fromUtf8(signal.sdp))
      })
      this.simplePeer.signal({
        type: 'offer',
        sdp: this.offer.sdpb.getUtf8()
      })
    })
  }

  private async fetchAnswer(): Promise<Answer> {
    return new Answer(
      this.client.nonce,
      this.offer.getId(),
      await this.fetchAnswerSdpb()
    )
  }

  private async connect(): Promise<void> {

    const answer = await this.fetchAnswer()

    this.setStatus(FRIEND_STATUS.CONNECTING)

    this.client.signalingClientsByOfferIdHex[this.offer.getId().getHex()].sendAnswer(answer)

    await delay(this.client.signalTimeoutMs * 2)

    if (this.status === FRIEND_STATUS.CONNECTING) {
      this.destroy()
    }
  }

  destroy(): void {
    const friendIndex = this.client.introverts.indexOf(this)
    this.client.introverts.splice(friendIndex, 1)
    super.destroy()
  }

}
