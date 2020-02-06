import { Friendship, FriendshipStruct } from '../Friendship';
import { Offer } from '../Signal/Offer';
export declare class Introvert extends Friendship {
    constructor(offer: Offer, struct: Omit<FriendshipStruct, 'initiator'>);
}
