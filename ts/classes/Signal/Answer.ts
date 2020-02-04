import { Uish, Uu } from 'pollenium-uvaursi'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../../templates/signalingMessage'
import { Signal } from '../Signal'
import { Bytes32 } from 'pollenium-buttercup'

export interface PartialAnswer {
  offerId: Uish;
  sdpb: Uish;
}

export class Answer extends Signal {

  readonly clientId: Bytes32;
  readonly offerId: Bytes32;
  readonly sdpb: Uu;

  constructor(struct: {
    clientId: Uish,
    offerId: Uish,
    sdpb: Uish
  }) {
    super()
    this.clientId = new Bytes32(struct.clientId)
    this.offerId = new Bytes32(struct.offerId)
    this.sdpb = Uu.wrap(struct.sdpb)
  }

  getEncoding(): Uu {
    return Uu.wrap(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.ANSWER,
        value: {
          clientId: this.clientId.uu.unwrap(),
          offerId: this.offerId.uu.unwrap(),
          sdpb: this.sdpb.unwrap()
        }
      })
    )
  }

  static fromHenpojo(henpojo: any): Answer {
    return new Answer({
      clientId: henpojo.clientId,
      offerId: henpojo.offerId,
      sdpb: henpojo.sdpb
    })
  }
}
