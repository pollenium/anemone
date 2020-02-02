import { Uish, Uu } from 'pollenium-uvaursi'
import { Bytes32 } from 'pollenium-buttercup'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../../templates/signalingMessage'
import { Signal } from '../Signal'

export class Offer extends Signal {

  readonly id: Bytes32;
  readonly clientId: Bytes32;
  readonly sdpb: Uu;

  constructor(struct: {
    id: Uish,
    clientId: Uish,
    sdpb: Uish
  }) {
    super()
    this.id = new Bytes32(struct.id)
    this.clientId = new Bytes32(struct.clientId)
    this.sdpb = Uu.wrap(struct.sdpb)
  }

  getEncoding(): Uu {
    return Uu.wrap(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.OFFER,
        value: {
          id: this.id.uu.unwrap(),
          clientId: this.clientId.uu.unwrap(),
          sdpb: this.sdpb.unwrap()
        }
      })
    )
  }

  static fromHenpojo(henpojo: any): Offer {
    return new Offer({
      id: henpojo.id,
      clientId: henpojo.clientId,
      sdpb: henpojo.sdpb
    })
  }
}
