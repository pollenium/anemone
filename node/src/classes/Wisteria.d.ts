import { Snowdrop } from 'pollenium-snowdrop';
import { Uu, Uish } from 'pollenium-uvaursi';
export interface WisteriaStruct {
    url: string;
}
export declare class Wisteria {
    private struct;
    private openPrimrose;
    private closePrimrose;
    private webSocket;
    readonly dataSnowdrop: Snowdrop<Uu>;
    private isOpen;
    private dataQueue;
    constructor(struct: WisteriaStruct);
    private connect;
    handleData(data: Uish): void;
    private send;
}
