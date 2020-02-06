import { Snowdrop } from 'pollenium-snowdrop';
import { FriendshipsGroup } from '../FriendshipsGroup';
import { Introvert } from '../Friendship/Introvert';
import { Offer } from '../Signal/Offer';
import { PartialAnswer } from '../Signal/Answer';
export declare class IntrovertsGroup extends FriendshipsGroup<Introvert> {
    readonly partialAnswerSnowdrop: Snowdrop<PartialAnswer>;
    create(offer: Offer): Promise<void>;
}
