export interface HashcashWorkerRequest {
    noncelessPrehashHex: string;
    difficulty: number;
    cover: number;
    applicationDataLength: number;
    timeoutAt: number;
}
export declare enum HASHCASH_WORKER_RESOLUTION_KEY {
    SUCCESS = 0,
    TIMEOUT_ERROR = 1,
    GENERIC_ERROR = 2
}
export interface HashcashWorkerResolution {
    key: HASHCASH_WORKER_RESOLUTION_KEY;
    value: string;
}
