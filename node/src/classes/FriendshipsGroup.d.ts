import { Bytes32 } from 'pollenium-buttercup';
import { Snowdrop } from 'pollenium-snowdrop';
import { Friendship, FriendshipStruct, DESTROY_REASON } from './Friendship';
import { Missive } from './Missive';
import { FriendshipsGroupSummary } from './FriendshipsGroupSummary';
export interface FriendshipsGroupStruct extends Omit<FriendshipStruct, 'initiator'> {
}
export declare class FriendshipsGroup<FriendshipClass extends Friendship> {
    protected struct: FriendshipsGroupStruct;
    readonly summarySnowdrop: Snowdrop<FriendshipsGroupSummary>;
    readonly destroyedSnowdrop: Snowdrop<void>;
    readonly banSnowdrop: Snowdrop<Bytes32>;
    private friendships;
    constructor(struct: FriendshipsGroupStruct);
    protected addFriendship(friendship: FriendshipClass): void;
    getFriendshipsCount(): number;
    getHasAnUnconnectedFriendship(): boolean;
    destroyAnUnconnectedFriendship(reason: any): void;
    getPeerClientIds(): Array<Bytes32>;
    private getFriendshipWithPeerClientId;
    getHasFriendshipWithPeerClientId(peerClientId: Bytes32): boolean;
    destroyFriendshipWithPeerClientId(peerClientId: Bytes32, destroyReason: DESTROY_REASON): void;
    private removeFriendship;
    private emitSummary;
    getSummary(): FriendshipsGroupSummary;
    broadcastMissive(missive: Missive): void;
}
