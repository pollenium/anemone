import { Uish, Uu } from 'pollenium-uvaursi'
import { Uint256 } from 'pollenium-buttercup'
import * as shasta from 'pollenium-shasta'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Offer {

  clientNonce: Uu

  sdpb: Uu

  constructor(struct: {
    clientNonce: Uish,
    sdpb: Uish
  }) {
    this.clientNonce = Uu.wrap(struct.clientNonce)
    this.sdpb = Uu.wrap(struct.sdpb)
  }

  getEncoding(): Uu {
    return Uu.wrap(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.OFFER,
        value: {
          clientNonce: this.clientNonce.unwrap(),
          sdpb: this.sdpb.unwrap()
        }
      })
    )
  }

  getId(): Uu {
    return shasta.genSha256(this.getEncoding())
  }

  getDistance(clientNonce: Uish): Uint256 {
    return new Uint256(this.clientNonce.genXor(clientNonce))
  }

  static fromHenpojo(henpojo: any): Offer {
    return new Offer({
      clientNonce: henpojo.clientNonce,
      sdpb: henpojo.clientNonce
    })
  }
}
