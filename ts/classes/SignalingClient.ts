import { Uu } from 'pollenium-uvaursi'
import { Snowdrop } from 'pollenium-snowdrop'
import { Offer } from './Signal/Offer'
import { Flush } from './Signal/Flush'
import { Answer } from './Signal/Answer'
import {
  SIGNALING_MESSAGE_KEY,
  signalingMessageTemplate,
} from '../templates/signalingMessage'
import { Wisteria } from './Wisteria'

export class SignalingClient {

  private wisteria: Wisteria;

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>();
  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>();
  readonly flushOfferSnowdrop: Snowdrop<Flush> = new Snowdrop<Flush>();

  constructor(struct: { url: string; }) {
    this.wisteria = new Wisteria(struct)
    this.wisteria.dataSnowdrop.addHandle((data) => {
      const signalingMessageHenpojo = signalingMessageTemplate.decode(data.u)
      switch (signalingMessageHenpojo.key) {
        case SIGNALING_MESSAGE_KEY.OFFER: {
          const offer = new Offer(signalingMessageHenpojo.value)
          this.offerSnowdrop.emit(offer)
          break
        }
        case SIGNALING_MESSAGE_KEY.ANSWER: {
          this.answerSnowdrop.emit(new Answer(signalingMessageHenpojo.value))
          break
        }
        case SIGNALING_MESSAGE_KEY.FLUSH: {
          this.flushOfferSnowdrop.emit(new Flush(signalingMessageHenpojo.value))
          break
        }
        default:
          throw new Error('Unhandled key')
      }
    })
  }

  private async send(data: Uu): Promise<void> {
    this.wisteria.handleData(data)
  }

  async sendOffer(offer: Offer): Promise<void> {
    await this.send(offer.getEncoding())
  }

  async sendAnswer(answer: Answer): Promise<void> {
    await this.send(answer.getEncoding())
  }

  async sendFlush(flushOffer: Flush): Promise<void> {
    await this.send(flushOffer.getEncoding())
  }

}
