import { Uish, Uu } from 'pollenium-uvaursi';
import { Bytes32 } from 'pollenium-buttercup';
import { Signal } from '../Signal';
export interface PartialOffer {
    id: Uish;
    sdpb: Uish;
}
export declare class Offer extends Signal {
    readonly id: Bytes32;
    readonly clientId: Bytes32;
    readonly sdpb: Uu;
    constructor(struct: {
        id: Uish;
        clientId: Uish;
        sdpb: Uish;
    });
    getEncoding(): Uu;
}
