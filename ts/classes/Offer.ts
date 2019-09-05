import { Bytes } from './Bytes'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Offer {
  constructor(public clientNonce: Bytes, public sdpb: Bytes) {}

  getEncoding() {
    return new Bytes(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.OFFER,
        value: {
          clientNonce: this.clientNonce.uint8Array,
          sdpb: this.sdpb.uint8Array
        }
      })
    )
  }

  getId() {
    return this.getEncoding().getHash()
  }

  static fromHenpojo(henpojo) {
    return new Offer(
      new Bytes(henpojo.clientNonce),
      new Bytes(henpojo.sdpb)
    )
  }
}
