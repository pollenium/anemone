import { Snowdrop } from 'pollenium-snowdrop'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'
import { SignalingClient } from './SignalingClient'
import {
  OffersDb,
  AnswersDb,
  FlushesDb,
} from './SignalsDb'

export interface SignalingClientsManagerStruct {
  WebSocket: typeof WebSocket;
  signalingServerUrls: string[];
}

export class SignalingClientsManager {

  private signalingClients: SignalingClient[] = []
  private signalingClientsByUrl: { [url: string]: SignalingClient; } = {}

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>()
  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>()
  readonly flushSnowdrop: Snowdrop<Flush> = new Snowdrop<Flush>()

  private offersDb: OffersDb = new OffersDb()
  private answersDb: AnswersDb = new AnswersDb()
  private flushesDb: FlushesDb = new FlushesDb()

  constructor(private struct: SignalingClientsManagerStruct) {
    struct.signalingServerUrls.forEach((url) => {
      this.create(url)
    })
  }

  private create(url: string): void {
    const signalingClient = new SignalingClient({
      url,
      WebSocket: this.struct.WebSocket,
    })
    this.signalingClients.push(signalingClient)
    this.signalingClientsByUrl[url] = signalingClient
    signalingClient.offerSnowdrop.addHandle((offer) => {
      this.offersDb.setUrlByOfferId(url, offer.id)
      this.offersDb.markIsReceived(offer)
      this.offerSnowdrop.emit(offer)
    })
    signalingClient.answerSnowdrop.addHandle((answer) => {
      if (this.answersDb.getIsReceived(answer)) {
        return
      }
      this.answersDb.markIsReceived(answer)
      this.answerSnowdrop.emit(answer)
    })
    signalingClient.flushOfferSnowdrop.addHandle((flushOffer) => {
      if (this.flushesDb.getIsReceived(flushOffer)) {
        return
      }
      this.flushesDb.markIsReceived(flushOffer)
      this.flushSnowdrop.emit(flushOffer)
    })
  }

  handleOffer(offer: Offer): void {
    this.signalingClients.forEach((signalingClient) => {
      signalingClient.sendOffer(offer)
    })
  }

  handleAnswer(answer: Answer): void {
    const url = this.offersDb.getUrlByOfferId(answer.offerId)
    if (url === null) {
      throw new Error('Unknown url')
    }
    this.signalingClientsByUrl[url].sendAnswer(answer)
  }

  handleFlush(flush: Flush): void {
    this.signalingClients.forEach((signalingClient) => {
      signalingClient.sendFlush(flush)
    })
  }

}
