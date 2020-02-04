/* eslint-disable max-classes-per-file */

import { Bytes32 } from 'pollenium-buttercup'
import { Signal } from './Signal'
import { Offer } from './Signal/Offer'
import { Answer } from './Signal/Answer'
import { Flush } from './Signal/Flush'

abstract class SignalsDb<SignalClass extends Signal> {
  private isReceivedByHashHex: { [idHex: string]: boolean; } = {};

  markIsReceived(signal: SignalClass): void {
    const hashHex = signal.getHash().uu.toHex()
    this.isReceivedByHashHex[hashHex] = true
  }

  getIsReceived(signal: SignalClass): boolean {
    const hashHex = signal.getHash().uu.toHex()
    return this.isReceivedByHashHex[hashHex] === true
  }
}

export class OffersDb extends SignalsDb<Offer> {

  private urlsByOfferIdHex: { [offerIdHex: string]: string; } = {}

  getUrlByOfferId(offerId: Bytes32): string | null {
    return this.urlsByOfferIdHex[offerId.uu.toHex()]
  }

  setUrlByOfferId(url: string, offerId: Bytes32): void {
    this.urlsByOfferIdHex[offerId.uu.toHex()] = url
  }

}

export class AnswersDb extends SignalsDb<Answer> {

}

export class FlushesDb extends SignalsDb<Flush> {

}
