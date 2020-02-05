import { Snowdrop } from 'pollenium-snowdrop'
import { FriendshipsGroup } from '../FriendshipsGroup'
import { Introvert } from '../Friendship/Introvert'
import { Offer } from '../Signal/Offer'
import { PartialAnswer } from '../Signal/Answer'

export class IntrovertsGroup extends FriendshipsGroup<Introvert> {

  readonly partialAnswerSnowdrop = new Snowdrop<PartialAnswer>();

  async create(offer: Offer): Promise<void> {
    const introvert = new Introvert(offer, this.struct)
    this.addFriendship(introvert)
    const sdpb = await introvert.fetchSdpb()
    this.partialAnswerSnowdrop.emit({
      offerId: offer.id,
      sdpb,
    })
  }

}
