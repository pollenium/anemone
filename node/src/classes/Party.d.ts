import { Snowdrop } from 'pollenium-snowdrop';
import { Bytes32, Uint256 } from 'pollenium-buttercup';
import { ExtrovertsGroupStruct } from './FriendshipsGroup/ExtrovertsGroup';
import { Offer, PartialOffer } from './Signal/Offer';
import { Answer, PartialAnswer } from './Signal/Answer';
import { Flush, PartialFlush } from './Signal/Flush';
import { FriendshipsGroupStruct } from './FriendshipsGroup';
import { Missive } from './Missive';
import { PartySummary } from './PartySummary';
export interface PeerClientIdAndDistance {
    peerClientId: Bytes32;
    distance: Uint256;
}
export interface PartyStruct extends FriendshipsGroupStruct, ExtrovertsGroupStruct {
    clientId: Bytes32;
    bootstrapOffersTimeout: number;
    maxFriendshipsCount: number;
    maxOfferAttemptsCount: number;
    maxOfferLastReceivedAgo: number;
}
export declare class Party {
    private struct;
    private offerInfos;
    private isClientIdBanned;
    private introvertsGroup;
    private extrovertsGroup;
    private introvertsGroupSummary;
    private extrovertsGroupSummary;
    private isBootstrapOffersComplete;
    readonly summarySnowdrop: Snowdrop<PartySummary>;
    readonly partialAnswerSnowdrop: Snowdrop<PartialAnswer>;
    readonly partialOfferSnowdrop: Snowdrop<PartialOffer>;
    readonly partialFlushSnowdrop: Snowdrop<PartialFlush>;
    readonly missiveSnowdrop: Snowdrop<Missive>;
    constructor(struct: PartyStruct);
    private clearOldOffers;
    private getBestConnectableOfferInfo;
    private maybeCreateFriendship;
    private maybeDestroyFriendship;
    private getPeerClientIdsAndDistances;
    private getWorstPeerClientIdAndDistance;
    private destroyFriendshipWithPeerClientId;
    private emitPartySummary;
    getSummary(): PartySummary;
    private getFriendshipsCount;
    handleOffer(offer: Offer): void;
    handleAnswer(answer: Answer): void;
    handleFlush(flush: Flush): void;
    getPeerClientIds(): Array<Bytes32>;
    broadcastMissive(missive: Missive): void;
    private banClientId;
}
