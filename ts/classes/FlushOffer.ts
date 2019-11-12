import { Buttercup } from 'pollenium-buttercup'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class FlushOffer {
  constructor(public offerId: Buttercup) {}

  getEncoding(): Buttercup {
    return new Buttercup(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.FLUSH_OFFER,
        value: {
          offerId: this.offerId.uint8Array
        }
      })
    )
  }

  getId(): Buttercup {
    return this.getEncoding().getHash()
  }

  static fromHenpojo(henpojo: any): FlushOffer {
    return new FlushOffer(
      new Buttercup(henpojo.offerId)
    )
  }
}
