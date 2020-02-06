import { Bytes32 } from 'pollenium-buttercup';
import { Summary, Jsonable } from './Summary';
import { PartySummary } from './PartySummary';
export declare class ClientSummary extends Summary {
    readonly struct: {
        id: Bytes32;
        partySummary: PartySummary;
    };
    readonly id: Bytes32;
    readonly partySummary: PartySummary;
    constructor(struct: {
        id: Bytes32;
        partySummary: PartySummary;
    });
    toJsonable(): Jsonable;
}
