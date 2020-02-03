import { Friendship, FRIENDSHIP_STATUS, DESTROY_REASON } from '../Friendship'
import { Answer } from '../Signal/Answer'
import SimplePeer from 'simple-peer'
import { genSimplePeerConfig } from '../../utils/genSimplePeerConfig'
import { Bytes32 } from 'pollenium-buttercup'
import { Uu } from 'pollenium-uvaursi'

export class Extrovert extends Friendship {

  constructor(options: {
    wrtc: any
    missiveLatencyTolerance: number,
  }) {
    super({
      ...options,
      initiator: true
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
      sdpb: answer.sdpb
    })
    this.startConnectOrDestroyTimeout(5)
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
