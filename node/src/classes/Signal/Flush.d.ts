import { Uu, Uish } from 'pollenium-uvaursi';
import { Bytes32 } from 'pollenium-buttercup';
import { Signal } from '../Signal';
export interface PartialFlush {
    offerId: Uish;
}
export declare class Flush extends Signal {
    readonly offerId: Bytes32;
    constructor(struct: {
        offerId: Uish;
    });
    getEncoding(): Uu;
}
