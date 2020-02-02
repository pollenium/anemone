import { FriendshipsGroup } from '../FriendshipsGroup'
import { Extrovert } from '../Friendship/Extrovert'
import { IPartialOffer, IPartialFlush } from '../../interfaces/Signal'
import { Snowdrop } from 'pollenium-snowdrop'
import { Answer } from '../Signal/Answer'
import { Bytes32 } from 'pollenium-buttercup'
import { Uu } from 'pollenium-uvaursi'

export class ExtrovertsGroup extends FriendshipsGroup<Extrovert> {

  private extrovertsByOfferIdHex: { [offerIdHex: string]: Extrovert } = {}

  readonly partialOfferSnowdrop = new Snowdrop<IPartialOffer>();
  readonly partialFlushSnowdrop = new Snowdrop<IPartialFlush>();

  create(options: {
    wrtc: any
    missiveLatencyTolerance: number
  }): void {
    const extrovert = new Extrovert(options)
    const offerId = Uu.genRandom(32)
    this.addFriendship(extrovert)
    extrovert.destroyedSnowdrop.addHandle(() => {
      delete this.extrovertsByOfferIdHex[offerId.toHex()]
      this.partialFlushSnowdrop.emit({
        offerId
      })
    })
    extrovert.fetchSdpb().then((sdpb) => {
      this.extrovertsByOfferIdHex[offerId.toHex()] = extrovert
      const partialOffer = {
        id: offerId,
        sdpb
      }
      this.partialOfferSnowdrop.emit(partialOffer)
      const intervalId = setInterval(() => {
        if (extrovert.getIsConnectable()) {
          this.partialOfferSnowdrop.emit(partialOffer)
        } else {
          clearInterval(intervalId)
        }
      }, 5000)

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
    } else {
      return null
    }
  }
}
