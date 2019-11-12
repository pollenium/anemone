import { Buttercup } from 'pollenium-buttercup'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Answer {
  constructor(public clientNonce: Buttercup, public offerId: Buttercup, public sdpb: Buttercup) {}

  getEncoding(): Buttercup {
    return new Buttercup(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.ANSWER,
        value: {
          clientNonce: this.clientNonce.uint8Array,
          offerId: this.offerId.uint8Array,
          sdpb: this.sdpb.uint8Array
        }
      })
    )
  }

  static fromHenpojo(henpojo: any): Answer {
    return new Answer(
      new Buttercup(henpojo.clientNonce),
      new Buttercup(henpojo.offerId),
      new Buttercup(henpojo.sdpb)
    )
  }
}
