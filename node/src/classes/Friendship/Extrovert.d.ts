import { Friendship, FriendshipStruct } from '../Friendship';
import { Answer } from '../Signal/Answer';
export declare class Extrovert extends Friendship {
    constructor(struct: Omit<FriendshipStruct, 'initiator'>);
    handleAnswer(answer: Answer): void;
    getIsConnectable(): boolean;
}
