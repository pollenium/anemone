import { Bytes32 } from 'pollenium-buttercup';
import { Signal } from './Signal';
import { Offer } from './Signal/Offer';
import { Answer } from './Signal/Answer';
import { Flush } from './Signal/Flush';
declare abstract class SignalsDb<SignalClass extends Signal> {
    private isReceivedByHashHex;
    markIsReceived(signal: SignalClass): void;
    getIsReceived(signal: SignalClass): boolean;
}
export declare class OffersDb extends SignalsDb<Offer> {
    private urlsByOfferIdHex;
    getUrlByOfferId(offerId: Bytes32): string | null;
    setUrlByOfferId(url: string, offerId: Bytes32): void;
}
export declare class AnswersDb extends SignalsDb<Answer> {
}
export declare class FlushesDb extends SignalsDb<Flush> {
}
export {};
