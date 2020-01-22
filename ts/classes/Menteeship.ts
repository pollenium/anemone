import { connection as WsConnection } from 'websocket'
import { SignalingServer } from './SignalingServer'
import { Buttercup } from 'pollenium-buttercup'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { FlushOffer } from './FlushOffer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'
import { Snowdrop } from 'pollenium-snowdrop'

export class Menteeship {

  bootstrapPromise: Promise<void>;

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>();

  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>();

  readonly flushOfferSnowdrop: Snowdrop<FlushOffer> = new Snowdrop<FlushOffer>();

  constructor(public signalingServer: SignalingServer, public wsConnection: WsConnection) {
    this.bootstrapPromise = this.bootstrap()
  }

  async bootstrap(): Promise<void> {
    this.wsConnection.on('message', (message) => {
      if (message.type !== 'binary') {
        return
      }
      const signalingMessageHenpojo = signalingMessageTemplate.decode(new Uint8Array(message.binaryData))

      switch(signalingMessageHenpojo.key) {
        case SIGNALING_MESSAGE_KEY.OFFER:
          this.offerSnowdrop.emitIfHandle(Offer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        case SIGNALING_MESSAGE_KEY.ANSWER:
          this.answerSnowdrop.emitIfHandle(Answer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        case SIGNALING_MESSAGE_KEY.FLUSH_OFFER:
          this.flushOfferSnowdrop.emitIfHandle(FlushOffer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        default:
          throw new Error('Unhandled SIGNALING_MESSAGE_KEY')
      }
    })
  }

  send(bytes: Buttercup): void {
    this.wsConnection.sendBytes(bytes.getBuffer())
  }

  async sendOffer(offer: Offer): Promise<void> {
    await this.send(offer.getEncoding())
  }

  async sendAnswer(answer: Answer): Promise<void> {
    await this.send(answer.getEncoding())
  }

  async sendFlushOffer(flushOffer: FlushOffer): Promise<void> {
    await this.send(flushOffer.getEncoding())
  }
}
