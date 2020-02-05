import {
  Friendship,
  FRIENDSHIP_STATUS,
  FriendshipStruct,
} from '../Friendship'
import { Offer } from '../Signal/Offer'

export class Introvert extends Friendship {

  constructor(offer: Offer, struct: Omit<FriendshipStruct, 'initiator'>) {
    super({
      ...struct,
      initiator: false,
    })
    this.setPeerClientId(offer.clientId)
    this.setStatus(FRIENDSHIP_STATUS.CONNECTING)
    this.sendSignal({
      type: 'offer',
      sdpb: offer.sdpb,
    })
    this.startConnectOrDestroyTimeout()
  }

}
