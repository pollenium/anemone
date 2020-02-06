import { Snowdrop } from 'pollenium-snowdrop';
import { Offer } from './Signal/Offer';
import { Answer } from './Signal/Answer';
import { Flush } from './Signal/Flush';
export interface SignalingClientsManagerStruct {
    signalingServerUrls: string[];
}
export declare class SignalingClientsManager {
    private struct;
    private signalingClients;
    private signalingClientsByUrl;
    readonly offerSnowdrop: Snowdrop<Offer>;
    readonly answerSnowdrop: Snowdrop<Answer>;
    readonly flushSnowdrop: Snowdrop<Flush>;
    private offersDb;
    private answersDb;
    private flushesDb;
    constructor(struct: SignalingClientsManagerStruct);
    private create;
    handleOffer(offer: Offer): void;
    handleAnswer(answer: Answer): void;
    handleFlush(flush: Flush): void;
}
