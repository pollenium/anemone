import { Uu } from 'pollenium-uvaursi';
import { Bytes32 } from 'pollenium-buttercup';
export declare abstract class Signal {
    private hash;
    getHash(): Bytes32;
    abstract getEncoding(): Uu;
}
