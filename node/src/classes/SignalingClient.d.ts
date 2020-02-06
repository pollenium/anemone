import { Snowdrop } from 'pollenium-snowdrop';
import { Offer } from './Signal/Offer';
import { Flush } from './Signal/Flush';
import { Answer } from './Signal/Answer';
export declare class SignalingClient {
    private wisteria;
    readonly offerSnowdrop: Snowdrop<Offer>;
    readonly answerSnowdrop: Snowdrop<Answer>;
    readonly flushOfferSnowdrop: Snowdrop<Flush>;
    constructor(struct: {
        url: string;
    });
    private send;
    sendOffer(offer: Offer): Promise<void>;
    sendAnswer(answer: Answer): Promise<void>;
    sendFlush(flushOffer: Flush): Promise<void>;
}
