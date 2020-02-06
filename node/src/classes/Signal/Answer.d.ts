import { Uish, Uu } from 'pollenium-uvaursi';
import { Bytes32 } from 'pollenium-buttercup';
import { Signal } from '../Signal';
export interface PartialAnswer {
    offerId: Uish;
    sdpb: Uish;
}
export declare class Answer extends Signal {
    readonly clientId: Bytes32;
    readonly offerId: Bytes32;
    readonly sdpb: Uu;
    constructor(struct: {
        clientId: Uish;
        offerId: Uish;
        sdpb: Uish;
    });
    getEncoding(): Uu;
}
