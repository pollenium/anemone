import EventEmitter from 'events'
import { connection as WsConnection } from 'websocket'
import { SignalingServer } from './SignalingServer'
import { Bytes } from './Bytes'
import { Offer } from './Offer'
import { Answer } from './Answer'
import { FlushOffer } from './FlushOffer'
import { SIGNALING_MESSAGE_KEY, signalingMessageTemplate } from '../templates/signalingMessage'

export class Menteeship extends EventEmitter {

  bootstrapPromise: Promise<void>;

  constructor(public signalingServer: SignalingServer, public wsConnection: WsConnection) {
    super()
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
          this.emit('offer', Offer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        case SIGNALING_MESSAGE_KEY.ANSWER:
          this.emit('answer', Answer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        case SIGNALING_MESSAGE_KEY.FLUSH_OFFER:
          this.emit('flushOffer', FlushOffer.fromHenpojo(signalingMessageHenpojo.value))
          break;
        default:
          throw new Error('Unhandled SIGNALING_MESSAGE_KEY')
      }
    })
  }

  send(bytes: Bytes): void {
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
