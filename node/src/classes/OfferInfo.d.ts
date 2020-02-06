import { Bytes32, Uint256 } from 'pollenium-buttercup';
import { Offer } from './Signal/Offer';
export declare class OfferInfo {
    readonly offer: Offer;
    readonly clientId: Bytes32;
    private attemptsCount;
    private firstReceivedAt;
    private lastReceivedAt;
    private distance;
    constructor(struct: {
        offer: Offer;
        clientId: Bytes32;
    });
    getAttemptsCount(): number;
    getFirstReceivedAgo(): number;
    getLastReceivedAgo(): number;
    incrementAttemptsCount(): void;
    updateLastReceivedAt(): void;
    getDistance(): Uint256;
}
