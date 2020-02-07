import { Bytes32 } from 'pollenium-buttercup';
import { Snowdrop } from 'pollenium-snowdrop';
import { Friendship } from './Friendship';
import { Extrovert } from './Friendship/Extrovert';
import { Introvert } from './Friendship/Introvert';
import { SignalingClientsManagerStruct } from './SignalingClientsManager';
import { PartyStruct } from './Party';
import { Missive } from './Missive';
import { ClientSummary } from './ClientSummary';
export interface ClientStruct extends Omit<PartyStruct, 'clientId'>, SignalingClientsManagerStruct {
}
export declare const clientDefaults: Omit<ClientStruct, 'signalingServerUrls'>;
export declare class Client {
    readonly id: Bytes32;
    readonly friendshipStatusSnowdrop: Snowdrop<Friendship>;
    readonly extrovertSnowdrop: Snowdrop<Extrovert>;
    readonly introvertSnowdrop: Snowdrop<Introvert>;
    readonly missiveSnowdrop: Snowdrop<Missive>;
    readonly summarySnowdrop: Snowdrop<ClientSummary>;
    private party;
    private signalingClientsManager;
    private maxFriendshipsConnectedPrimrose;
    private isMissiveReceivedByHashHex;
    private isMissiveBroadcastedByHashHex;
    constructor(struct: ClientStruct);
    getSummary(): ClientSummary;
    broadcastMissive(missive: Missive): void;
}
