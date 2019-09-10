import { client as WsClient, connection as WsConnection } from 'websocket'
import EventEmitter from 'events'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class SignalingClient extends EventEmitter {

  bootstrapPromise: Promise<void>;

  wsClient: WsClient;

  wsConnectionPromise: Promise<WsConnection>;

  constructor(public signalingServerUrl: string) {
    super()
    this.bootstrapPromise = this.bootstrap()
  }

  async bootstrap(): Promise<void> {
    this.wsClient = new WsClient()
    this.wsConnectionPromise = this.fetchConnection()

    const wsConnection = await this.fetchConnection()

    wsConnection.on('message', (message) => {
      if (message.type !== 'binary') {
        return
      }

      const signalingMessageHenpojo = signalingMessageTemplate.decode(new Uint8Array(message.binaryData))
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
        default:
          throw new Error('Unhandled key')
      }
    })

  }

  async fetchConnection(): Promise<WsConnection> {
    if (this.wsConnectionPromise) {
      return this.wsConnectionPromise
    }

    const wsConnectionPromise: Promise<WsConnection> = new Promise((resolve, reject): void => {
      this.wsClient.once('connectFailed', (error: Error) => {
        reject(error)
      })
      this.wsClient.once('connect', (wsConnection: WsConnection) => {
        resolve(wsConnection)
      })
    })

    this.wsClient.once('close', () => {
      delete this.wsConnectionPromise
      this.wsConnectionPromise = this.fetchConnection()
    })

    this.wsClient.connect(this.signalingServerUrl)

    return wsConnectionPromise
  }

  async send(bytes: Bytes): Promise<void> {
    const wsConnection = await this.fetchConnection()
    wsConnection.sendBytes(bytes.getBuffer())
  }

  async sendOffer(offer: Offer): Promise<void> {
    await this.send(offer.getEncoding())
  }

  async sendAnswer(answer: Answer): Promise<void> {
    await this.send(answer.getEncoding())
  }

}
