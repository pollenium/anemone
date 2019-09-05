import * as EventEmitter from 'events'
import { wsConnection as WsConnection } from 'websocket'
import { SignalingServer } from './SignalingServer'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

let debugId = 0;

export class Menteeship extends EventEmitter {

  debugId: number = debugId++;
  bootstrapPromise;

  constructor(public signalingServer: SignalingServer, public wsConnection: WsConnection) {
    super()
    this.bootstrapPromise = this.bootstrap()
  }

  async bootstrap() {
    // this.signalingServer.offers.forEach((offer) => {
    //   this.sendOffer(offer)
    // })
    this.wsConnection.on('message', (message) => {
      if (message.type !== 'binary') {
        return
      }
      const signalingMessageHenpojo = signalingMessageTemplate.decode(new Uint8Array(message.binaryData))
      switch(signalingMessageHenpojo.key) {
        case SIGNALING_MESSAGE_KEY.OFFER:
          this.emit('offer', Offer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        case SIGNALING_MESSAGE_KEY.ANSWER:
          this.emit('answer', Answer.fromHenpojo(signalingMessageHenpojo.value))
          break;
      }
    })
  }

  async send(bytes: Bytes) {
    this.wsConnection.sendBytes(bytes.getBuffer())
  }

  async sendOffer(offer: Offer) {
    await this.send(offer.getEncoding())
  }

  async sendAnswer(answer: Answer) {
    await this.send(answer.getEncoding())
  }
}
