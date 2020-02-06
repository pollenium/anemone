import { Bytes32 } from 'pollenium-buttercup';
import { Summary, Jsonable } from './Summary';
import { FRIENDSHIP_STATUS } from './Friendship';
import { OfferInfo } from './OfferInfo';
import { FriendshipsGroupSummary } from './FriendshipsGroupSummary';
export declare class PartySummary extends Summary {
    readonly struct: {
        peerClientIds: Array<Bytes32>;
        extrovertsGroupSummary: FriendshipsGroupSummary;
        introvertsGroupSummary: FriendshipsGroupSummary;
        offerInfos: Array<OfferInfo>;
    };
    readonly createdAt: number;
    constructor(struct: {
        peerClientIds: Array<Bytes32>;
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
