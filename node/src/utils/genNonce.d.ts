import { Uish } from 'pollenium-uvaursi';
import { Uintable, Uint256 } from 'pollenium-buttercup';
export declare class TimeoutError extends Error {
    constructor();
}
export declare function genNonce(struct: {
    noncelessPrehash: Uish;
    difficulty: Uintable;
    cover: Uintable;
    applicationDataLength: Uintable;
    timeoutAt: number;
}): Uint256;
