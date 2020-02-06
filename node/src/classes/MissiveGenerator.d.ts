import { Uint8, Uintable } from 'pollenium-buttercup';
import { Uu, Uish } from 'pollenium-uvaursi';
import { Missive } from './Missive';
export declare class MissiveGenerator {
    missivePromise: Promise<Missive>;
    applicationId: Uu;
    applicationData: Uu;
    difficulty: Uint8;
    ttl: number;
    hashcashWorkerUrl: string;
    constructor(struct: {
        applicationId: Uish;
        applicationData: Uish;
        difficulty: Uintable;
        ttl: number;
        hashcashWorkerUrl: string;
    });
    private getNoncelessPrehash;
    private fetchNonce;
    fetchMissive(): Promise<Missive>;
}
