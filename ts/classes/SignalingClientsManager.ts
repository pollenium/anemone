import { Signal } from './Signal'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'
import { SignalingClient } from './SignalingClient'
import { Bytes32 } from 'pollenium-buttercup'
import { Snowdrop } from 'pollenium-snowdrop'

export class SignalingClientsManager {

  private signalingClients: SignalingClient[] = [];
  private signalingClientsByUrl: { [url: string]: SignalingClient } = {}

  readonly offerSnowdrop: Snowdrop<Offer> = new Snowdrop<Offer>();
  readonly answerSnowdrop: Snowdrop<Answer> = new Snowdrop<Answer>();
  readonly flushSnowdrop: Snowdrop<Flush> = new Snowdrop<Flush>();

  private offersDb: OffersDb = new OffersDb;
  private answersDb: AnswersDb = new AnswersDb;
  private flushesDb: FlushesDb = new FlushesDb;

  constructor(urls: Array<string>) {
    urls.forEach((url) => {
      this.create(url)
    })
  }

  private create(url: string): void {
    const signalingClient = new SignalingClient(url)
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

  handleOffer(offer: Offer) {
    this.signalingClients.forEach((signalingClient) => {
      signalingClient.sendOffer(offer)
    })
  }

  handleAnswer(answer: Answer) {
    const url = this.offersDb.getUrlByOfferId(answer.offerId)
    if (url === null) {
      throw new Error('Unknown url')
    }
    this.signalingClientsByUrl[url].sendAnswer(answer)
  }

  handleFlush(flush: Flush) {
    this.signalingClients.forEach((signalingClient) => {
      signalingClient.sendFlush(flush)
    })
  }

}

abstract class SignalDb<SignalClass extends Signal> {
  private isReceivedByHashHex: { [idHex: string]: boolean} = {};

  markIsReceived(signal: SignalClass) {
    const hashHex = signal.getHash().uu.toHex()
    this.isReceivedByHashHex[hashHex] = true
  }

  getIsReceived(signal: SignalClass): boolean {
    const hashHex = signal.getHash().uu.toHex()
    return this.isReceivedByHashHex[hashHex] === true
  }
}

class OffersDb extends SignalDb<Offer> {

  private urlsByOfferIdHex: { [offerIdHex: string]: string} = {}

  getUrlByOfferId(offerId: Bytes32): string | null {
    const url = this.urlsByOfferIdHex[offerId.uu.toHex()]
    if (url) {
      return url
    } else {
      return null
    }
  }

  setUrlByOfferId(url: string, offerId: Bytes32): void {
    this.urlsByOfferIdHex[offerId.uu.toHex()] = url
  }

}

class AnswersDb extends SignalDb<Answer> {

}

class FlushesDb extends SignalDb<Flush> {

}
