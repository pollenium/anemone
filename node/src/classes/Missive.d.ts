import { Uintable, Uint40, Uint256, Uint8, Bytes32 } from 'pollenium-buttercup';
import { Uu, Uish } from 'pollenium-uvaursi';
import { MISSIVE_KEY } from '../templates/missive';
export declare enum MISSIVE_COVER {
    V0 = 69
}
export declare class Missive {
    readonly cover: MISSIVE_COVER;
    readonly version: MISSIVE_KEY;
    readonly timestamp: Uint40;
    readonly difficulty: Uint8;
    readonly nonce: Uu;
    readonly applicationId: Bytes32;
    readonly applicationData: Uu;
    constructor(struct: {
        version: MISSIVE_KEY;
        nonce: Uish;
        applicationId: Uish;
        applicationData: Uish;
        timestamp: Uintable;
        difficulty: Uintable;
    });
    getEncoding(): Uu;
    getHash(): Bytes32;
    getScore(): Uint256;
    getEra(): number;
    getMaxScore(): Uint256;
    getIsValid(): boolean;
    static fromHenpojo(henpojo: any): Missive;
    static fromEncoding(encoding: Uish): Missive;
}
