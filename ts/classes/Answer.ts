import { Uish, Uu } from 'pollenium-uvaursi'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Answer {

  clientNonce: Uu;

  offerId: Uu;

  sdpb: Uu;

  constructor(struct: {
    clientNonce: Uish,
    offerId: Uish,
    sdpb: Uish
  }) {
    this.clientNonce = Uu.wrap(struct.clientNonce)
    this.offerId = Uu.wrap(struct.offerId)
    this.sdpb = Uu.wrap(struct.sdpb)
  }

  getEncoding(): Uu {
    return Uu.wrap(
      signalingMessageTemplate.encode({
        key: SIGNALING_MESSAGE_KEY.ANSWER,
        value: {
          clientNonce: this.clientNonce.unwrap(),
          offerId: this.offerId.unwrap(),
          sdpb: this.sdpb.unwrap()
        }
      })
    )
  }

  static fromHenpojo(henpojo: any): Answer {
    return new Answer({
      clientNonce: henpojo.clientNonce,
      offerId: henpojo.offerId,
      sdpb: henpojo.sdpb
    })
  }
}
