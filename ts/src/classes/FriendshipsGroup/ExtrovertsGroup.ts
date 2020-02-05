import { Snowdrop } from 'pollenium-snowdrop'
import { Bytes32 } from 'pollenium-buttercup'
import { Uu } from 'pollenium-uvaursi'
import { FriendshipsGroup, FriendshipsGroupStruct } from '../FriendshipsGroup'
import { Extrovert } from '../Friendship/Extrovert'
import { PartialOffer } from '../Signal/Offer'
import { Answer } from '../Signal/Answer'
import { PartialFlush } from '../Signal/Flush'

export interface ExtrovertsGroupStruct extends FriendshipsGroupStruct {
  offerReuploadInterval: number;
}

export class ExtrovertsGroup extends FriendshipsGroup<Extrovert> {

  constructor(private extrovertGroupStruct: ExtrovertsGroupStruct) {
    super({ ...extrovertGroupStruct })
  }

  private extrovertsByOfferIdHex: Record<string, Extrovert> = {};

  readonly partialOfferSnowdrop = new Snowdrop<PartialOffer>();
  readonly partialFlushSnowdrop = new Snowdrop<PartialFlush>();

  create(): void {
    const extrovert = new Extrovert(this.struct)
    const offerId = Uu.genRandom(32)
    this.addFriendship(extrovert)
    extrovert.destroyedSnowdrop.addHandle(() => {
      delete this.extrovertsByOfferIdHex[offerId.toHex()]
      this.partialFlushSnowdrop.emit({
        offerId,
      })
    })
    extrovert.fetchSdpb().then((sdpb) => {
      this.extrovertsByOfferIdHex[offerId.toHex()] = extrovert
      const partialOffer = {
        id: offerId,
        sdpb,
      }
      this.partialOfferSnowdrop.emit(partialOffer)
      const intervalId = setInterval(() => {
        if (extrovert.getIsConnectable()) {
          this.partialOfferSnowdrop.emit(partialOffer)
        } else {
          clearInterval(intervalId)
        }
      }, this.extrovertGroupStruct.offerReuploadInterval * 1000)
    })
  }

  handleAnswer(answer: Answer): void {
    const extrovert = this.getExtrovertByOfferId(answer.offerId)
    if (extrovert === null) {
      return
    }
    extrovert.handleAnswer(answer)
  }

  private getExtrovertByOfferId(offerId: Bytes32): Extrovert | null {
    const extrovert = this.extrovertsByOfferIdHex[offerId.uu.toHex()]
    if (extrovert) {
      return extrovert
    }
    return null
  }

}
