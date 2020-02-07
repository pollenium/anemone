import { Bytes32 } from 'pollenium-buttercup'
import { Snowdrop } from 'pollenium-snowdrop'
import {
  Friendship,
  FriendshipStruct,
  FRIENDSHIP_STATUS,
  DESTROY_REASON,
} from './Friendship'
import { Missive } from './Missive'
import { FriendshipsGroupSummary } from './FriendshipsGroupSummary'

export interface FriendshipsGroupStruct extends Omit<FriendshipStruct, 'initiator'> {}

export class FriendshipsGroup<FriendshipClass extends Friendship> {

  readonly summarySnowdrop: Snowdrop<FriendshipsGroupSummary> = new Snowdrop<
    FriendshipsGroupSummary
  >();
  readonly destroyedSnowdrop: Snowdrop<void> = new Snowdrop<void>();
  readonly banSnowdrop: Snowdrop<Bytes32> = new Snowdrop<Bytes32>();
  readonly missiveSnowdrop: Snowdrop<Missive> = new Snowdrop<Missive>();

  private friendships: Array<FriendshipClass> = [];

  constructor(protected struct: FriendshipsGroupStruct) {}

  protected addFriendship(friendship: FriendshipClass): void {
    friendship.statusSnowdrop.addHandle(() => {
      this.emitSummary()
    })

    friendship.banSnowdrop.addHandle((clientId) => {
      this.banSnowdrop.emit(clientId)
    })

    friendship.destroyedSnowdrop.addHandle(() => {
      this.removeFriendship(friendship)
      this.destroyedSnowdrop.emit()
      this.emitSummary()
    })

    friendship.missiveSnowdrop.addHandle((missive) => {
      this.missiveSnowdrop.emit(missive)
    })

    this.friendships.push(friendship)
    this.emitSummary()
  }

  getFriendshipsCount(): number {
    return this.friendships.length
  }

  getHasAnUnconnectedFriendship(): boolean {
    for (let i = 0; i < this.friendships.length; i++) {
      if (this.friendships[i].getStatus() !== FRIENDSHIP_STATUS.CONNECTED) {
        return true
      }
    }
    return false
  }

  destroyAnUnconnectedFriendship(reason): void {
    const friendship = this.friendships.find((_friendship) => {
      return _friendship.getStatus() !== FRIENDSHIP_STATUS.CONNECTED
    })
    if (!friendship) {
      throw new Error('No unconnected friendships')
    }
    friendship.destroy(reason)
  }

  getPeerClientIds(): Array<Bytes32> {
    return this.friendships
      .map((friendship) => {
        return friendship.getPeerClientId()
      })
      .filter((peerClientId) => {
        return peerClientId !== null
      })
  }

  private getFriendshipWithPeerClientId(peerClientId: Bytes32): Friendship | null {
    const friendship = this.friendships.find((_friendship) => {
      const _peerClientId = _friendship.getPeerClientId()
      if (_peerClientId === null) {
        return false
      }
      if (_peerClientId.uu.getIsEqual(peerClientId.uu)) {
        return true
      }
      return false
    })
    if (friendship) {
      return friendship
    }
    return null
  }

  getHasFriendshipWithPeerClientId(peerClientId: Bytes32): boolean {
    return !!this.getFriendshipWithPeerClientId(peerClientId)
  }

  destroyFriendshipWithPeerClientId(
    peerClientId: Bytes32,
    destroyReason: DESTROY_REASON,
  ): void {
    const friendship = this.getFriendshipWithPeerClientId(peerClientId)
    if (friendship) {
      friendship.destroy(destroyReason)
    } else {
      throw new Error('No friendship with that peer client id')
    }
  }

  private removeFriendship(friendship: FriendshipClass): void {
    const index = this.friendships.indexOf(friendship)
    if (index === -1) {
      throw new Error('Friendship is not in friendships array')
    }
    this.friendships.splice(index, 1)
  }

  private emitSummary(): void {
    this.summarySnowdrop.emit(this.getSummary())
  }

  getSummary(): FriendshipsGroupSummary {
    return new FriendshipsGroupSummary(this.friendships)
  }

  broadcastMissive(missive: Missive): void {
    this.friendships.forEach((friendship) => {
      friendship.maybeSendMissive(missive)
    })
  }

}
