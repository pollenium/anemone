import {
  Friendship,
  FRIENDSHIP_STATUS,
  FriendshipStruct,
} from '../Friendship'
import { Answer } from '../Signal/Answer'

export class Extrovert extends Friendship {

  constructor(struct: Omit<FriendshipStruct, 'initiator'>) {
    super({
      ...struct,
      initiator: true,
    })
  }

  handleAnswer(answer: Answer): void {
    if (this.getStatus() !== FRIENDSHIP_STATUS.DEFAULT) {
      return
    }
    this.setPeerClientId(answer.clientId)
    this.setStatus(FRIENDSHIP_STATUS.CONNECTING)
    this.sendSignal({
      type: 'answer',
      sdpb: answer.sdpb,
    })
    this.startConnectOrDestroyTimeout()
  }

  getIsConnectable(): boolean {
    if (this.getIsDestroyed()) {
      return false
    }
    if (this.getStatus() !== FRIENDSHIP_STATUS.DEFAULT) {
      return false
    }
    return true
  }

}
