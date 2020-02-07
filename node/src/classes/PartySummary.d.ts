import { Summary, Jsonable } from './Summary';
import { FRIENDSHIP_STATUS } from './Friendship';
import { OfferInfo } from './OfferInfo';
import { FriendshipsGroupSummary } from './FriendshipsGroupSummary';
import { PeerClientIdAndDistance } from './Party';
export declare class PartySummary extends Summary {
    readonly struct: {
        peerClientIdAndDistances: Array<PeerClientIdAndDistance>;
        extrovertsGroupSummary: FriendshipsGroupSummary;
        introvertsGroupSummary: FriendshipsGroupSummary;
        offerInfos: Array<OfferInfo>;
    };
    readonly createdAt: number;
    constructor(struct: {
        peerClientIdAndDistances: Array<PeerClientIdAndDistance>;
        extrovertsGroupSummary: FriendshipsGroupSummary;
        introvertsGroupSummary: FriendshipsGroupSummary;
        offerInfos: Array<OfferInfo>;
    });
    getFriendshipsCount(): number;
    getFriendshipsCountByStatus(friendshipStatus: FRIENDSHIP_STATUS): number;
    getFriendshipsCountsByStatus(): Record<number, number>;
    toJsonable(): Jsonable;
    toJson(): string;
}
