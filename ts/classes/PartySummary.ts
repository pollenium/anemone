import { $enum } from 'ts-enum-util'
import { Summary, Jsonable } from './Summary'
import { genTime } from '../utils/genTime'
import { FRIENDSHIP_STATUS } from './Friendship'
import { OfferInfo } from './OfferInfo'
import { FriendshipsGroupSummary } from './FriendshipsGroupSummary'

export class PartySummary extends Summary {

  readonly createdAt: number = genTime();

  constructor(
    readonly struct: {
      extrovertsGroupSummary: FriendshipsGroupSummary;
      introvertsGroupSummary: FriendshipsGroupSummary;
      offerInfos: Array<OfferInfo>;
    },
  ) {
    super()
  }

  getFriendshipsCount(): number {
    return (
      this.struct.extrovertsGroupSummary.getFriendshipsCount()
      + this.struct.introvertsGroupSummary.getFriendshipsCount()
    )
  }

  getFriendshipsCountByStatus(friendshipStatus: FRIENDSHIP_STATUS): number {
    return (
      this.struct.extrovertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus)
      + this.struct.introvertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus)
    )
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
      createdAt: this.createdAt,
      createdAgo: genTime() - this.createdAt,
      friendshipsCount: this.getFriendshipsCount(),
      connectedFriendshipsCount: this.getFriendshipsCountByStatus(FRIENDSHIP_STATUS.CONNECTED),
      offersCount: this.struct.offerInfos.length,
      offerInfos: this.struct.offerInfos.map((offerInfo) => {
        return {
          idHex: offerInfo.offer.id.uu.toHex(),
          offerClientIdHex: offerInfo.offer.clientId.uu.toHex(),
          attemptsCount: offerInfo.getAttemptsCount(),
          firstReceivedAgo: offerInfo.getFirstReceivedAgo(),
          lastReceivedAgo: offerInfo.getLastReceivedAgo(),
          distance: offerInfo.getDistance().uu.toHex(),
        }
      }),
      friendshipsCountsByStatus: this.getFriendshipsCountsByStatus(),
      introvertsGroup: this.struct.introvertsGroupSummary.toJsonable(),
      extrovertsGroup: this.struct.extrovertsGroupSummary.toJsonable(),
    }
  }

  toJson(): string {
    return JSON.stringify(this.toJsonable(), null, 2)
  }

}
