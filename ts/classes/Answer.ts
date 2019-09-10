import { Bytes } from './Bytes'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Answer {
  constructor(public clientNonce: Bytes, public offerId: Bytes, public sdpb: Bytes) {}

  getEncoding(): Bytes {
    return new Bytes(
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
      new Bytes(henpojo.clientNonce),
      new Bytes(henpojo.offerId),
      new Bytes(henpojo.sdpb)
    )
  }
}
