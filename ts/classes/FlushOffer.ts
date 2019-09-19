import { Bytes } from './Bytes'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class FlushOffer {
  constructor(public offerId: Bytes) {}

  getEncoding(): Bytes {
    return new Bytes(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.FLUSH_OFFER,
        value: {
          offerId: this.offerId.uint8Array
        }
      })
    )
  }

  getId(): Bytes {
    return this.getEncoding().getHash()
  }

  static fromHenpojo(henpojo: any): FlushOffer {
    return new FlushOffer(
      new Bytes(henpojo.offerId)
    )
  }
}
