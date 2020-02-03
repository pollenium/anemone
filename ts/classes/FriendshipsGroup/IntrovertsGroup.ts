import { FriendshipsGroup } from '../FriendshipsGroup'
import { Introvert } from '../Friendship/Introvert'
import { IPartialAnswer } from '../../interfaces/Signal'
import { Snowdrop } from 'pollenium-snowdrop'
import { Offer } from '../Signal/Offer'
import { Answer } from '../Signal/Answer'

export class IntrovertsGroup extends FriendshipsGroup<Introvert> {
  readonly partialAnswerSnowdrop = new Snowdrop<IPartialAnswer>()

  async create(offer: Offer): Promise<void> {
    const introvert = new Introvert(offer, this.options)
    this.addFriendship(introvert)
    const sdpb = await introvert.fetchSdpb()
    this.partialAnswerSnowdrop.emit({
      offerId: offer.id,
      sdpb
    })
  }

}
