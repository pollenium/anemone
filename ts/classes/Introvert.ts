import { Friendship, FRIENDSHIP_STATUS } from './Friendship'
import { Offer } from './Offer'
import { Answer } from './Answer'
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer'
import { getSimplePeerConfig } from '../utils'
import delay from 'delay'
import { Buttercup } from 'pollenium-buttercup'
import { Client } from './Client'


export class Introvert extends Friendship {

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

  private fetchAnswerSdpb(): Promise<Buttercup> {
    return new Promise((resolve): void => {
      this.simplePeer.once('signal', (signal: SimplePeerSignalData) => {
        resolve(Buttercup.fromUtf8(signal.sdp))
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

    this.setStatus(FRIENDSHIP_STATUS.CONNECTING)

    const answer = await this.fetchAnswer()

    this.client.signalingClientsByOfferIdHex[this.offer.getId().getHex()].sendAnswer(answer)

    await delay(this.client.signalTimeoutMs * 2)

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
