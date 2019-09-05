import { client as WsClient, wsConnection as WsConnection } from 'websocket'
import * as EventEmitter from 'events'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

let debugId = 0;

export class SignalingClient extends EventEmitter {

  debugId: number = debugId++;
  bootstrapPromise;
  wsClient;
  wsConnectionPromise;

  constructor(public signalingServerUrl: String) {
    super()
    this.bootstrapPromise = this.bootstrap()
  }

  async bootstrap() {
    this.wsClient = new WsClient()
    this.wsConnectionPromise = this.fetchConnection()

    const wsConnection = await this.fetchConnection()

    wsConnection.on('message', (message) => {
      if (message.type !== 'binary') {
        return
      }

      const signalingMessageHenpojo = signalingMessageTemplate.decode(new Uint8Array(message.binaryData))
      switch(signalingMessageHenpojo.key) {
        case SIGNALING_MESSAGE_KEY.OFFER:
          const offer = Offer.fromHenpojo(signalingMessageHenpojo.value)
          this.emit('offer', offer)
          break;
        case SIGNALING_MESSAGE_KEY.ANSWER:
          this.emit('answer', Answer.fromHenpojo(signalingMessageHenpojo.value))
          break;
      }
    })

  }

  async fetchConnection(): Promise<WsConnection> {
    if (this.wsConnectionPromise) {
      return this.wsConnectionPromise
    }

    const wsConnectionPromise: Promise<WsConnection> = new Promise((resolve, reject) => {
      this.wsClient.once('connectFailed', (error) => {
        reject(error)
      })
      this.wsClient.once('connect', (wsConnection) => {
        resolve(wsConnection)
      })
    })

    this.wsClient.once('close', (wsConnection) => {
      delete this.wsConnectionPromise
      this.wsConnectionPromise = this.fetchConnection()
    })

    this.wsClient.connect(this.signalingServerUrl)

    return wsConnectionPromise
  }

  async send(bytes: Bytes) {
    const wsConnection = await this.fetchConnection()
    wsConnection.sendBytes(bytes.getBuffer())
  }

  async sendOffer(offer: Offer) {
    await this.send(offer.getEncoding())
  }

  async sendAnswer(answer: Answer) {
    await this.send(answer.getEncoding())
  }

}
