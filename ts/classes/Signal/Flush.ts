import { Uu, Uish } from 'pollenium-uvaursi'
import { Bytes32 } from 'pollenium-buttercup'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../../templates/signalingMessage'
import { Signal } from '../Signal'

export class Flush extends Signal {

  readonly offerId: Bytes32

  constructor(struct: {
    offerId: Uish
  }) {
    super()
    this.offerId = new Bytes32(struct.offerId)
  }

  getEncoding(): Uu {
    return signalingMessageTemplate.encode({
      key: SIGNALING_MESSAGE_KEY.FLUSH,
      value: {
        offerId: this.offerId.uu.unwrap()
      }
    })
  }

  static fromHenpojo(henpojo: any): Flush {
    return new Flush({
      offerId: henpojo.offerId
    })
  }
}
