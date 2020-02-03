import { Friendship, FRIENDSHIP_STATUS, DESTROY_REASON } from './Friendship'
import { Bytes32 } from 'pollenium-buttercup'
import { Snowdrop } from 'pollenium-snowdrop'
import { $enum } from 'ts-enum-util'
import { Missive } from './Missive'

export class FriendshipsGroup<FriendshipClass extends Friendship> {

  readonly summarySnowdrop: Snowdrop<FriendshipsGroupSummary> = new Snowdrop<FriendshipsGroupSummary>();
  readonly destroyedSnowdrop: Snowdrop<void> = new Snowdrop<void>();
  readonly banSnowdrop: Snowdrop<Bytes32> = new Snowdrop<Bytes32>();

  private friendships: Array<FriendshipClass> = [];

  protected addFriendship(friendship: FriendshipClass) {
    friendship.statusSnowdrop.addHandle((status) => {
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
    const friendship = this.friendships.find((friendship) => {
      return friendship.getStatus() !== FRIENDSHIP_STATUS.CONNECTED
    })
    if (!friendship) {
      throw new Error('No unconnected friendships')
    }
    friendship.destroy(reason)
  }

  getPeerClientIds(): Array<Bytes32> {
    return this.friendships.map((friendship) => {
      return friendship.getPeerClientId()
    }).filter((peerClientId) => {
      return peerClientId !== null
    })
  }

  private getFriendshipWithPeerClientId(peerClientId: Bytes32): Friendship | null {
    const friendship = this.friendships.find((friendship) => {
      const _peerClientId = friendship.getPeerClientId()
      if (_peerClientId === null) {
        return false
      }
      if (_peerClientId.uu.getIsEqual(peerClientId.uu)) {
        return true
      } else {
        return false
      }
    })
    if (friendship) {
      return friendship
    } else {
      return null
    }
  }

  getHasFriendshipWithPeerClientId(peerClientId: Bytes32): boolean {
    return this.getFriendshipWithPeerClientId(peerClientId) ? true : false
  }

  destroyFriendshipWithPeerClientId(peerClientId: Bytes32, destroyReason: DESTROY_REASON): void {
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

  broadcastMissive(missive: Missive) {
    this.friendships.forEach((friendship) => {
      friendship.sendMissive(missive)
    })
  }


}

export class FriendshipsGroupSummary {

  private statuses: Array<FRIENDSHIP_STATUS> = []

  constructor(private friendships: Array<Friendship>) {
    this.statuses.push(...friendships.map((friendship) => {
      return friendship.getStatus()
    }))
  }

  getFriendshipsCount(): number {
    return this.friendships.length
  }

  getFriendshipsCountByStatus(status: FRIENDSHIP_STATUS): number {
    return this.statuses.filter((_status) => {
      return status === _status
    }).length
  }

  getFriendshipsCountsByStatus(): { [status: number]: number } {
    const friendshipsCountsByStatus: { [status: number]: number } = {}
    $enum(FRIENDSHIP_STATUS).forEach((status) => {
      friendshipsCountsByStatus[status] = this.getFriendshipsCountByStatus(status)
    })
    return friendshipsCountsByStatus
  }

  toJsonable(): Object {
    return {
      friendshipsCount: this.getFriendshipsCount(),
      friendshipsCountsByStatus: this.getFriendshipsCountsByStatus()
    }

  }

  toJson(): string {
    return JSON.stringify(this.toJsonable(), null, 2)
  }

}
