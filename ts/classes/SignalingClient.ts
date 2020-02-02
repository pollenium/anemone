import { Client } from './Client'
import { Uu, Uish } from 'pollenium-uvaursi'
import { Offer } from './Signal/Offer'
import { Flush } from './Signal/Flush'
import { Answer } from './Signal/Answer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'
import { Snowdrop } from 'pollenium-snowdrop'
import { Primrose } from 'pollenium-primrose'
import { Wisteria } from './Wisteria'

export class SignalingClient {

  private wisteria: Wisteria;

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>();
  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>();
  readonly flushOfferSnowdrop: Snowdrop<Flush> = new Snowdrop<Flush>();

  constructor(url: string) {
    this.wisteria = new Wisteria(url)

    this.wisteria.dataSnowdrop.addHandle((data) => {
      const signalingMessageHenpojo = signalingMessageTemplate.decode(data.u)
      switch(signalingMessageHenpojo.key) {
        case SIGNALING_MESSAGE_KEY.OFFER: {
          const offer = Offer.fromHenpojo(signalingMessageHenpojo.value)
          this.offerSnowdrop.emit(offer)
          break;
        }
        case SIGNALING_MESSAGE_KEY.ANSWER: {
          this.answerSnowdrop.emit(Answer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        }
        case SIGNALING_MESSAGE_KEY.FLUSH: {
          this.flushOfferSnowdrop.emit(Flush.fromHenpojo(signalingMessageHenpojo.value))
          break;
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
