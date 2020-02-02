import { connection as WsConnection } from 'websocket'
import { SignalingServer } from './SignalingServer'
import { Uish, Uu } from 'pollenium-uvaursi'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'
import { Snowdrop } from 'pollenium-snowdrop'

export class Menteeship {

  bootstrapPromise: Promise<void>;

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>();

  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>();

  readonly flushOfferSnowdrop: Snowdrop<Flush> = new Snowdrop<Flush>();

  constructor(public signalingServer: SignalingServer, public wsConnection: WsConnection) {
    this.bootstrapPromise = this.bootstrap()
  }

  private async bootstrap(): Promise<void> {
    this.wsConnection.on('message', (message) => {
      if (message.type !== 'binary') {
        return
      }
      const signalingMessageHenpojo = signalingMessageTemplate.decode(new Uint8Array(message.binaryData))

      switch(signalingMessageHenpojo.key) {
        case SIGNALING_MESSAGE_KEY.OFFER:
          const offer = Offer.fromHenpojo(signalingMessageHenpojo.value)
          this.offerSnowdrop.emit(offer)
          break;
        case SIGNALING_MESSAGE_KEY.ANSWER:
          this.answerSnowdrop.emit(Answer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        case SIGNALING_MESSAGE_KEY.FLUSH:
          this.flushOfferSnowdrop.emit(Flush.fromHenpojo(signalingMessageHenpojo.value))
          break;
        default:
          throw new Error('Unhandled SIGNALING_MESSAGE_KEY')
      }
    })
  }

  send(uish: Uish): void {
    const buffer = Buffer.from(Uu.wrap(uish).u)
    this.wsConnection.sendBytes(buffer)
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
