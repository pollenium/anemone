import { $enum } from 'ts-enum-util'
import {
  Friendship,
  FRIENDSHIP_STATUS,
} from './Friendship'
import { Summary, Jsonable } from './Summary'

export class FriendshipsGroupSummary extends Summary {

  private statuses: Array<FRIENDSHIP_STATUS> = [];

  constructor(private friendships: Array<Friendship>) {
    super()
    this.statuses.push(
      ...friendships.map((friendship) => {
        return friendship.getStatus()
      }),
    )
  }

  getFriendshipsCount(): number {
    return this.friendships.length
  }

  getFriendshipsCountByStatus(status: FRIENDSHIP_STATUS): number {
    return this.statuses.filter((_status) => {
      return status === _status
    }).length
  }

  getFriendshipsCountsByStatus(): Record<number, number> {
    const friendshipsCountsByStatus: Record<number, number> = {}
    $enum(FRIENDSHIP_STATUS).forEach((status) => {
      friendshipsCountsByStatus[status] = this.getFriendshipsCountByStatus(status)
    })
    return friendshipsCountsByStatus
  }

  toJsonable(): Jsonable {
    return {
      friendshipsCount: this.getFriendshipsCount(),
      friendshipsCountsByStatus: this.getFriendshipsCountsByStatus(),
    }
  }

  toJson(): string {
    return JSON.stringify(this.toJsonable(), null, 2)
  }

}
