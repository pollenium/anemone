import { Friendship, FRIENDSHIP_STATUS } from './Friendship';
import { Summary, Jsonable } from './Summary';
export declare class FriendshipsGroupSummary extends Summary {
    private friendships;
    private statuses;
    constructor(friendships: Array<Friendship>);
    getFriendshipsCount(): number;
    getFriendshipsCountByStatus(status: FRIENDSHIP_STATUS): number;
    getFriendshipsCountsByStatus(): Record<number, number>;
    toJsonable(): Jsonable;
    toJson(): string;
}
