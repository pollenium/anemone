import { Snowdrop } from 'pollenium-snowdrop';
import { FriendshipsGroup, FriendshipsGroupStruct } from '../FriendshipsGroup';
import { Extrovert } from '../Friendship/Extrovert';
import { PartialOffer } from '../Signal/Offer';
import { Answer } from '../Signal/Answer';
import { PartialFlush } from '../Signal/Flush';
export interface ExtrovertsGroupStruct extends FriendshipsGroupStruct {
    offerReuploadInterval: number;
}
export declare class ExtrovertsGroup extends FriendshipsGroup<Extrovert> {
    private extrovertGroupStruct;
    constructor(extrovertGroupStruct: ExtrovertsGroupStruct);
    private extrovertsByOfferIdHex;
    readonly partialOfferSnowdrop: Snowdrop<PartialOffer>;
    readonly partialFlushSnowdrop: Snowdrop<PartialFlush>;
    create(): void;
    handleAnswer(answer: Answer): void;
    private getExtrovertByOfferId;
}
