import { Bytes } from './Bytes'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Offer {
  constructor(public clientNonce: Bytes, public sdpb: Bytes) {}

  getEncoding(): Bytes {
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

  getId(): Bytes {
    return this.getEncoding().getHash()
  }

  getDistance(clientNonce: Bytes): Bytes {
    return this.clientNonce.getXor(clientNonce)
  }

  static fromHenpojo(henpojo: any): Offer {
    return new Offer(
      new Bytes(henpojo.clientNonce),
      new Bytes(henpojo.sdpb)
    )
  }
}
