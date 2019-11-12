import { Client } from './Client'
import { ConstructableWebSocket } from '../interfaces/ConstructableWebSocket'
import EventEmitter from 'events'
import { Buttercup } from 'pollenium-buttercup'
import { Offer } from './Offer'
import { FlushOffer } from './FlushOffer'
import { Answer } from './Answer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class SignalingClient extends EventEmitter {

  bootstrapPromise: Promise<void>;

  wsConnectionPromise: Promise<ConstructableWebSocket>;

  constructor(public client: Client, public signalingServerUrl: string) {
    super()
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
        this.emit('close')
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
        this.emit('offer', offer)
        break;
      }
      case SIGNALING_MESSAGE_KEY.ANSWER: {
        this.emit('answer', Answer.fromHenpojo(signalingMessageHenpojo.value))
        break;
      }
      case SIGNALING_MESSAGE_KEY.FLUSH_OFFER: {
        this.emit('flushOffer', FlushOffer.fromHenpojo(signalingMessageHenpojo.value))
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
