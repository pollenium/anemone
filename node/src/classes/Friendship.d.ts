import { Uu } from 'pollenium-uvaursi';
import { Bytes32 } from 'pollenium-buttercup';
import { Snowdrop } from 'pollenium-snowdrop';
import { Missive } from './Missive';
export declare enum FRIENDSHIP_STATUS {
    DEFAULT = 0,
    CONNECTING = 1,
    CONNECTED = 2
}
export declare enum BAN_REASON {
    MISSIVE_OLD = "MISSIVE_OLD",
    MISSIVE_TIMETRAVEL = "MISSIVE_TIMETRAVEL",
    MISSIVE_INVALID = "MISSIVE_INVALID",
    MISSIVE_DUPLICATE = "MISSIVE_DUPLICATE",
    MISSIVE_NONDECODABLE = "MISSIVE_NONDECODABLE"
}
export declare enum DESTROY_REASON {
    GOODBYE = "GOODBYE",
    BAN = "BAN",
    WRTC_CLOSE = "WRTC_CLOSE",
    WRTC_ERROR = "WRTC_ERROR",
    ICE_DISCONNECT = "ICE_DISCONNECT",
    ICE_FAILED = "ICE_FAILED",
    TOO_FAR = "TOO_FAR",
    NEW_OFFER = "NEW_OFFER",
    SDP_TIMEOUT = "SDP_TIMEOUT",
    CONNECTION_TIMEOUT = "CONNECTION_TIMEOUT"
}
export interface FriendshipStruct {
    initiator: boolean;
    missiveLatencyTolerance?: number;
    sdpTimeout?: number;
    connectionTimeout?: number;
}
export declare abstract class Friendship {
    private struct;
    private status;
    private peerClientId;
    private isDestroyed;
    private sdpbPrimrose;
    private simplePeer;
    private isMissiveReceivedByHashHex;
    readonly destroyedSnowdrop: Snowdrop<DESTROY_REASON>;
    readonly statusSnowdrop: Snowdrop<FRIENDSHIP_STATUS>;
    readonly missiveSnowdrop: Snowdrop<Missive>;
    readonly banSnowdrop: Snowdrop<Bytes32>;
    private banReason;
    private destroyReason;
    constructor(struct: FriendshipStruct);
    getPeerClientId(): Bytes32 | null;
    getStatus(): FRIENDSHIP_STATUS;
    fetchSdpb(): Promise<Uu>;
    getIsSendable(): boolean;
    maybeSendMissive(missive: Missive): void;
    private send;
    destroy(reason: DESTROY_REASON): void;
    protected startConnectOrDestroyTimeout(): void;
    protected setPeerClientId(peerClientId: Bytes32): void;
    protected setStatus(status: FRIENDSHIP_STATUS): void;
    protected getIsDestroyed(): boolean;
    protected sendSignal(struct: {
        type: string;
        sdpb: Uu;
    }): void;
    private banAndDestroy;
}
