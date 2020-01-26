import { Uu, Uish } from 'pollenium-uvaursi'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class FlushOffer {

  offerId: Uu

  constructor(offerId: Uish) {
    this.offerId = Uu.wrap(offerId)
  }

  getEncoding(): Uu {
    return signalingMessageTemplate.encode({
      key: SIGNALING_MESSAGE_KEY.FLUSH_OFFER,
      value: {
        offerId: this.offerId.unwrap()
      }
    })
  }

  getId(): Uu {
    return this.getEncoding()
  }

  static fromHenpojo(henpojo: any): FlushOffer {
    return new FlushOffer(
      henpojo.offerId
    )
  }
}
