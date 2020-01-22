import { Client } from './Client'
import { ConstructableWebSocket } from '../interfaces/ConstructableWebSocket'
import { Buttercup } from 'pollenium-buttercup'
import { Offer } from './Offer'
import { FlushOffer } from './FlushOffer'
import { Answer } from './Answer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'
import { Snowdrop } from 'pollenium-snowdrop'

export class SignalingClient {

  bootstrapPromise: Promise<void>;

  wsConnectionPromise: Promise<ConstructableWebSocket>;

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>();

  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>();

  readonly flushOfferSnowdrop: Snowdrop<FlushOffer> = new Snowdrop<FlushOffer>();

  readonly closeSnowdrop: Snowdrop<void> = new Snowdrop<void>();


  constructor(public client: Client, public signalingServerUrl: string) {
    this.fetchConnection()
  }

  async fetchConnection(): Promise<ConstructableWebSocket> {
    if (this.wsConnectionPromise) {
      return this.wsConnectionPromise
    }


    this.wsConnectionPromise = new Promise((resolve, reject): void => {

      const wsConnection = new this.client.options.WebSocket(this.signalingServerUrl)
      wsConnection.binaryType = 'arraybuffer'


      wsConnection.onopen = (): void => {
        resolve(wsConnection)
      }

      wsConnection.onerror = (error): void => {
        reject(error)
      }

      wsConnection.onclose = (): void => {
        delete this.wsConnectionPromise
        this.closeSnowdrop.emitIfHandle()
      }

      wsConnection.onmessage = this.handleWsConnectionMessage.bind(this)

    })

    return this.wsConnectionPromise
  }

  private handleWsConnectionMessage(message): void {
    const signalingMessageHenpojo = signalingMessageTemplate.decode(new Uint8Array(message.data))
    switch(signalingMessageHenpojo.key) {
      case SIGNALING_MESSAGE_KEY.OFFER: {
        const offer = Offer.fromHenpojo(signalingMessageHenpojo.value)
        this.offerSnowdrop.emitIfHandle(offer)
        break;
      }
      case SIGNALING_MESSAGE_KEY.ANSWER: {
        this.answerSnowdrop.emitIfHandle(Answer.fromHenpojo(signalingMessageHenpojo.value))
        break;
      }
      case SIGNALING_MESSAGE_KEY.FLUSH_OFFER: {
        this.flushOfferSnowdrop.emitIfHandle(FlushOffer.fromHenpojo(signalingMessageHenpojo.value))
        break;
      }
      default:
        throw new Error('Unhandled key')
    }
  }

  async send(bytes: Buttercup): Promise<void> {
    const wsConnection = await this.fetchConnection()
    wsConnection.send(bytes.getBuffer())
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
