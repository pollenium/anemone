import { Buttercup } from 'pollenium-buttercup'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Offer {
  constructor(public clientNonce: Buttercup, public sdpb: Buttercup) {}

  getEncoding(): Buttercup {
    return new Buttercup(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.OFFER,
        value: {
          clientNonce: this.clientNonce.uint8Array,
          sdpb: this.sdpb.uint8Array
        }
      })
    )
  }

  getId(): Buttercup {
    return this.getEncoding().getHash()
  }

  getDistance(clientNonce: Buttercup): Buttercup {
    return this.clientNonce.getXor(clientNonce)
  }

  static fromHenpojo(henpojo: any): Offer {
    return new Offer(
      new Buttercup(henpojo.clientNonce),
      new Buttercup(henpojo.sdpb)
    )
  }
}
